import { PrismaClient } from "@prisma/client";
import { ITheatreAdminAssignmentRepository, TheatreAdminAssignmentRecord } from "../../../domain/repositories/ITheatreAdminAssignmentRepository";


export class PrismaTheatreAdminAssignmentRepository implements ITheatreAdminAssignmentRepository {
    constructor(private readonly prisma: PrismaClient) { };

    async findByUserAndTheatre(userId: string, theatreId: string): Promise<TheatreAdminAssignmentRecord | null> {
        return this.prisma.theatreAdminAssignment.findUnique({
            where: {
                userId_theatreId: {
                    userId,
                    theatreId
                }
            }
        })
    }


    async create(userId: string, theatreId: string): Promise<TheatreAdminAssignmentRecord> {
        return this.prisma.theatreAdminAssignment.create({
            data: {
                userId,
                theatreId
             }
         })
    }

    async updateActiveStatus(assignmentId: string, isActive: boolean): Promise<TheatreAdminAssignmentRecord> {
        return this.prisma.theatreAdminAssignment.update({
            where: {
                id:assignmentId
            },
            data: {
                isActive
            }
        })
    }

    async findActiveByTheatre(theatreId: string): Promise<TheatreAdminAssignmentRecord[]> {
        return this.prisma.theatreAdminAssignment.findMany({
            where: {
                theatreId,
                isActive:true
            },
            orderBy: {
                createdAt:"asc"
            }
         })
    }
}
