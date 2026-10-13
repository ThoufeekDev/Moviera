import { PrismaClient } from "@prisma/client";
import { Role } from "../../../../../shared/enums/Role";
import { ForbiddenError } from "../../../../../shared/errors/ForbiddenError";
import { ITheatreAccessPolicy, TheatreAccessActor } from "../../../application/ports/ITheatreAccessPolicy";


export class PrismaTheatreAccessPolicy implements ITheatreAccessPolicy {
    constructor(private readonly prisma: PrismaClient) { };

    async  canManage(actor: TheatreAccessActor, theatreId: string): Promise<boolean> {
        if (actor.role === Role.SUPER_ADMIN) return true;
        if (actor.role !== Role.THEATRE_ADMIN) return false;

        const assignment = await this.prisma.theatreAdminAssignment.findFirst({
            where: {
                userId: actor.userId,
                theatreId,
                isActive: true,
                user: {
                    isActive:true,
                }
            },
            select: {
                id:true
            }
        })
        
        return !assignment;
    }
}