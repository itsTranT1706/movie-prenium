/**
 * Generic Repository Port - Base interface for all repositories
 * Domain layer defines WHAT operations are needed, not HOW they are implemented
 */
export interface RepositoryPort<T, ID = string> {
    findById(id: ID): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    delete(id: ID): Promise<void>;
    exists(id: ID): Promise<boolean>;
}
