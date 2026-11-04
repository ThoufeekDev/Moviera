import { ForbiddenError } from "../../../../shared/errors/ForbiddenError";
import type { PaginatedResult } from "../../../../shared/types/Pagination";
import type {
    ITheatreAccessPolicy,
    TheatreAccessActor
} from "../ports/ITheatreAccessPolicy";

import type { IScreenQueryService, ListScreensFilter } from "../ports/IScreenQueryService";
import type { ScreenListItem } from "../read-models/ScreenListItem";
import type { IUseCase } from "../../../../shared/application/interfaces/IUseCase";

export interface ListScreenRequest {
    theatreId: string;
    actor: TheatreAccessActor;
    query?: ListScreensFilter;
}

export class ListScreenUseCase implements IUseCase<ListScreenRequest, PaginatedResult<ScreenListItem>> {
    constructor(
        private readonly screenQueryService: IScreenQueryService,
        private readonly theatreAccessPolicy: ITheatreAccessPolicy,
    ) {}

    async execute(request: ListScreenRequest): Promise<PaginatedResult<ScreenListItem>> {
        const allowed = await this.theatreAccessPolicy.canManage(request.actor, request.theatreId);
        if (!allowed) throw new ForbiddenError('You are not assigned to manage this theatre');

        return this.screenQueryService.listByTheatre(request.theatreId, request.query);
    }
}
