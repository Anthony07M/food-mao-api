import { ValueObject } from '../value-objects/value.object';

export interface PaginatedResult<T> {
  currentPage: number;
  totalPages: number;
  data: T[];
}

export interface RepositoryInterface<Entity, ID extends ValueObject> {
  save(entity: Entity): Promise<Entity>;
  remove(entityId: ID): Promise<void>;
  update(entity: Entity): Promise<Entity>;
  findById(entityId: ID): Promise<Entity | null>;
  findAll(limit: number, skip: number): Promise<PaginatedResult<Entity>>;
}