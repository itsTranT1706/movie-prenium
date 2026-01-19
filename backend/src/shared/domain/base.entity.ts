/**
 * Base Entity - Framework-agnostic base class for all domain entities
 */
export abstract class BaseEntity<T> {
    protected readonly _id: T;

    constructor(id: T) {
        this._id = id;
    }

    get id(): T {
        return this._id;
    }

    public equals(entity?: BaseEntity<T>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }

        if (!(entity instanceof BaseEntity)) {
            return false;
        }

        return this._id === entity._id;
    }
}
