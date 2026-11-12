import type { Show } from '../entities/Show';
import { CreateShowData } from '../types/CreateShowData';

export interface IShowRepository {
  create(show: CreateShowData): Promise<Show>;
}