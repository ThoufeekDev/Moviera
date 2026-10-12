import { PrismaClient } from "@prisma/client";
import { Role } from "../../../../../shared/enums/Role";
import { ForbiddenError } from "../../../../../shared/errors/ForbiddenError";
import { ITheatreAccessPolicy, TheatreAccessActor } from "../../../application/ports/ITheatreAccessPolicy";


export class PrismaTheatreAccessPolicy implements ITheatreAccessPolicy {
    constructor(private readonly prisma: PrismaClient) { };

    async  assertCanManage(actor: TheatreAccessActor, theatreId: string): Promise<void> {
        if (actor.role === Role.SUPER_ADMIN) return;

        if (actor.role !== Role.THEATRE_ADMIN) throw new ForbiddenError("You are not authorized to manage this theatre");

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
        
        if(!assignment) throw new ForbiddenError("You are not assigned to manage this theatre")
    }
}