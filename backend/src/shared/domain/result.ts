/**
 * Result Pattern - For handling success/failure without exceptions
 * Used across all application use cases
 */
export class Result<T, E = Error> {
    private readonly _isSuccess: boolean;
    private readonly _value?: T;
    private readonly _error?: E;

    private constructor(isSuccess: boolean, value?: T, error?: E) {
        this._isSuccess = isSuccess;
        this._value = value;
        this._error = error;
    }

    get isSuccess(): boolean {
        return this._isSuccess;
    }

    get isFailure(): boolean {
        return !this._isSuccess;
    }

    get value(): T {
        if (!this._isSuccess) {
            throw new Error('Cannot get value of a failed result');
        }
        return this._value as T;
    }

    get error(): E {
        if (this._isSuccess) {
            throw new Error('Cannot get error of a successful result');
        }
        return this._error as E;
    }

    public static ok<T, E = Error>(value?: T): Result<T, E> {
        return new Result<T, E>(true, value);
    }

    public static fail<T, E = Error>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }
}
