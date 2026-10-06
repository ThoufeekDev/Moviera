import prisma from "../../../../config/database";

import { Seat } from "../../domain/entities/Seat";
import type { ISeatRepository } from "../../domain/repositories/ISeatRepository";
import type { CreateSeatProps } from "../../domain/types/CreateSeatProps";
import  { SeatMapper } from "../mappers/SeatMapper";



export class PrismaSeatRepository implements ISeatRepository {

    async findById(id: string): Promise<Seat | null> {
        const seat = await prisma.seat.findUnique({
            where: {
                 id
             }
        })
        
        return seat ? SeatMapper.toDomain(seat) : null;
    }


    async findByLabel(screenId: string,label:string): Promise<Seat | null> {
        const seat = await prisma.seat.findUnique({
            where: {
                screenId_label: {
                    screenId,
                    label,
             }
            }
        })

        return seat?SeatMapper.toDomain(seat) : null
    }


    async create(data: CreateSeatProps): Promise<Seat> {
        const createdSeat = await prisma.seat.create({
            data: {
                screenId: data.screenId,
                rowLabel: data.rowLabel,
                seatNumber: data.seatNumber,
                label: data.label,
                x: data.x,
                y: data.y,
                rotation: data.rotation,
                type: data.type
             }
        })
        
        return SeatMapper.toDomain(createdSeat)
    }
}