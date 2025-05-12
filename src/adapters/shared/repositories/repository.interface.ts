import { ValueObject } from '../value-objects/value.object';

export interface RepositoryInterface<Entity, ID extends ValueObject> {
  save(entity: Entity): Promise<void>;
  remove(entityId: ID): Promise<void>;
  update(entity: Entity): Promise<void>;
  findById(entityId: ID): Promise<Entity | null>;
  findAll(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Entity[] }>;
}
