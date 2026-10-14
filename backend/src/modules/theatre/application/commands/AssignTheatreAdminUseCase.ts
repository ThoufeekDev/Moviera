import type { IUseCase } from '../../../../shared/application/interfaces/IUseCase';
import { ITheatreAdminAssignmentRepository } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import { ITheatreAdminUserReader } from '../ports/ITheatreAdminUserReader';
import { ITheatreAdminUserManager } from '../ports/ITheatreAdminUserManager';
import { IEmailService } from '../../../../shared/domain/services/IEmailService';
import type { TheatreAdminAssignmentRecord } from '../../domain/repositories/ITheatreAdminAssignmentRepository';
import {
  AssignTheatreAdminDTO,
  AssignTheatreAdminResult,
} from '../dtos/AssignTheatreAdminDTO';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { Role } from '../../../../shared/enums/Role';
import { TheatreAdminAssignmentRole } from '@prisma/client';
import { generateTemporaryPassword } from '../../../../shared/utils/generateTemporaryPassword';
import { hashPassword } from '../../../../shared/utils/hashPassword';

export class AssignTheatreAdminUseCase implements IUseCase<
  AssignTheatreAdminDTO,
  AssignTheatreAdminResult
> {
  constructor(
    private readonly theatreRepository: ITheatreRepository,
    private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
    private readonly userReader: ITheatreAdminUserReader,
    private readonly userManager?: ITheatreAdminUserManager,
    private readonly emailService?: IEmailService,
    private readonly clientUrl?: string,
  ) {}

  async execute(request: AssignTheatreAdminDTO): Promise<AssignTheatreAdminResult> {
    if (!request.theatreId) {
      throw new BadRequestError('Theatre ID is required');
    }

    if (!request.userId && !request.email) {
      throw new BadRequestError('Either an existing administrator ID or an email address is required');
    }

    const theatre = await this.theatreRepository.findById(request.theatreId);
    if (!theatre || !theatre.isActive) {
      throw new NotFoundError('Active theatre not found');
    }

    const role =
      (request.role as TheatreAdminAssignmentRole) ??
      TheatreAdminAssignmentRole.OPERATIONS_SUPERVISOR;

    let targetUserId = request.userId;
    let userSummary: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
    let temporaryPassword: string | undefined;
    let isNewUser = false;

    // Flow A: Administrator created or looked up via Email
    if (request.email) {
      if (!this.userManager) {
        throw new Error('TheatreAdminUserManager is not configured');
      }

      const normalizedEmail = request.email.toLowerCase().trim();
      let existingUser = await this.userManager.findByEmail(normalizedEmail);

      if (!existingUser) {
        isNewUser = true;
        temporaryPassword = generateTemporaryPassword(12);
        const passwordHash = await hashPassword(temporaryPassword);

        const newAdmin = await this.userManager.createTheatreAdmin({
          name: request.name?.trim() || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          phone: request.phone?.trim(),
          passwordHash,
        });

        targetUserId = newAdmin.id;
        userSummary = {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          phone: newAdmin.phone,
        };
      } else {
        if (!existingUser.isActive) {
          throw new BadRequestError('User account exists but is currently suspended');
        }

        // If user is currently a regular USER, elevate to THEATRE_ADMIN
        if (existingUser.role !== Role.THEATRE_ADMIN) {
          const promoted = await this.userManager.promoteToTheatreAdmin(existingUser.id, {
            phone: request.phone?.trim() || undefined,
            name: request.name?.trim() || existingUser.name,
          });
          targetUserId = promoted.id;
          userSummary = {
            id: promoted.id,
            name: promoted.name,
            email: promoted.email,
            phone: promoted.phone,
          };
        } else {
          targetUserId = existingUser.id;
          userSummary = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
          };
        }
      }
    } else {
      // Flow B: Existing Administrator by User ID
      const user = await this.userReader.findById(request.userId!);

      if (!user || !user.isActive) {
        throw new NotFoundError('Active user not found');
      }

      if (user.role !== Role.THEATRE_ADMIN) {
        throw new BadRequestError('User must have the Theatre_Admin role');
      }

      targetUserId = user.id;
      userSummary = {
        id: user.id,
        name: user.name || 'Administrator',
        email: user.email || '',
        phone: user.phone || null,
      };
    }

    if (!targetUserId) {
      throw new BadRequestError('Failed to resolve target administrator user');
    }

    // Role check: If assigning as Primary Manager, ensure no other active Primary Manager exists
    if (role === TheatreAdminAssignmentRole.PRIMARY_MANAGER) {
      const currentPrimaryManager =
        await this.assignmentRepository.findActivePrimaryManagerByTheatre(request.theatreId);

      if (currentPrimaryManager && currentPrimaryManager.userId !== targetUserId) {
        throw new BadRequestError('This theatre already has an active primary manager');
      }
    }

    // Reuse or update existing assignment if one exists
    const existingAssignment = await this.assignmentRepository.findByUserAndTheatre(
      targetUserId,
      request.theatreId,
    );

    let assignment: TheatreAdminAssignmentRecord;

    if (existingAssignment) {
      if (existingAssignment.isActive && existingAssignment.role === role) {
        assignment = existingAssignment;
      } else {
        assignment = await this.assignmentRepository.updateAssignment(existingAssignment.id, {
          isActive: true,
          role,
        });
      }
    } else {
      assignment = await this.assignmentRepository.create(targetUserId, request.theatreId, role);
    }

    // Send credentials / authorization welcome email
    let emailSent = false;
    if (this.emailService && userSummary.email) {
      try {
        const clientBase =
          this.clientUrl || process.env.CLIENT_URL || 'http://localhost:5173';
        await this.emailService.sendTheatreAdminCredentialsEmail({
          email: userSummary.email,
          name: userSummary.name,
          theatreName: theatre.name,
          role,
          loginUrl: `${clientBase}/theatre-admin/login`,
          temporaryPassword,
          isNewUser,
        });
        emailSent = true;
      } catch (err) {
        console.error('[AssignTheatreAdminUseCase] Error dispatching credentials email:', err);
      }
    }

    return {
      id: assignment.id,
      userId: assignment.userId,
      theatreId: assignment.theatreId,
      role: assignment.role,
      isActive: assignment.isActive,
      user: {
        id: userSummary.id,
        name: userSummary.name,
        email: userSummary.email,
        phone: userSummary.phone || null,
      },
      theatre: {
        id: theatre.id,
        name: theatre.name,
      },
      temporaryPassword,
      isNewUser,
      emailSent,
    };
  }
}
