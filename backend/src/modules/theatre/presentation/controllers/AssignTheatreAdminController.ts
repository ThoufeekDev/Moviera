import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { HttpRequest, HttpResponse } from '../../../../shared/http/HttpTypes';
import { created } from '../../../../shared/http/response';
import { AssignTheatreAdminUseCase } from '../../application/commands/AssignTheatreAdminUseCase';
import { AssignTheatreAdminDTO } from '../../application/dtos/AssignTheatreAdminDTO';

export class AssignTheatreAdminController {
    constructor(private readonly assignTheatreAdminUseCase: AssignTheatreAdminUseCase) { };
    handle = async (req: HttpRequest<unknown,AssignTheatreAdminDTO>): Promise<HttpResponse> => {
        
        if (!req.user?.userId) throw new UnauthorizedError('Authentication required');

        await this.assignTheatreAdminUseCase.execute(req.body);

        return created(undefined, 'Theatre admin assigned succesfully..');

  };
}
