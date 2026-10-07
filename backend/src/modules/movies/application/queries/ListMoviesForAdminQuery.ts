import { MovieStatus } from './MovieStatus';
import { ListMoviesQuery } from './ListMoviesQuery';

export interface ListMoviesForAdminQuery extends ListMoviesQuery {

  status?: MovieStatus;
  releaseDateFrom?: Date;
  releaseDateTo?: Date;

}