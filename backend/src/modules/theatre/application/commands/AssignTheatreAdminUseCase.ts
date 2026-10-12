import type { IUseCase } from "../../../../shared/application/interfaces/IUseCase";
import { ITheatreAdminAssignmentRepository } from "../../domain/repositories/ITheatreAdminAssignmentRepository";
import { ITheatreRepository } from "../../domain/repositories/ITheatreRepository";
import { ITheatreAdminUserReader } from "../ports/ITheatreAdminUserReader";
import type {TheatreAdminAssignmentRecord} from "../../domain/repositories/ITheatreAdminAssignmentRepository"
import { AssignTheatreAdminDTO } from "../dtos/AssignTheatreAdminDTO";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Role } from "../../../../shared/enums/Role";




export class AssignTheatreAdminUseCase implements IUseCase<AssignTheatreAdminDTO,TheatreAdminAssignmentRecord>{


    constructor(
        private readonly theatreRepository: ITheatreRepository,
        private readonly assignmentRepository: ITheatreAdminAssignmentRepository,
        private readonly userReader:ITheatreAdminUserReader,
    ) { };


    async execute(request: AssignTheatreAdminDTO): Promise<TheatreAdminAssignmentRecord>{
          
        if (!request.userId || !request.theatreId) throw new BadRequestError('User ID and theatre ID are requried');

        const user = await this.userReader.findById(request.userId);

        if (!user || !user.isActive) throw new NotFoundError('Active user not found');

        if (user.role !== Role.THEATRE_ADMIN) throw new BadRequestError('User must ahve the Theatre_Admin role');

        // ^ Reuse an existing assignment if one already exists.
        const existingAssignment = await this.assignmentRepository.findByUserAndTheatre(request.userId, request.theatreId);

        if (existingAssignment?.isActive) return existingAssignment;

        // ! Reactivate an inactive assignment instead of duplicating it

        if (existingAssignment) return this.assignmentRepository.updateActiveStatus(existingAssignment.id, true);

        return this.assignmentRepository.create(request.userId,request.theatreId);
    
    }
}