class Success<S, F> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public isSuccess(): this is Success<S, F> {
    return true;
  }
}

class Failure<S, F> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  public isFailure(): this is Failure<S, F> {
    return true;
  }

  public isSuccess(): this is Success<S, F> {
    return false;
  }
}

export const failure = <S, F>(value: F) => {
  return new Failure<S, F>(value);
};

export const success = <S, F>(value: S) => {
  return new Success<S, F>(value);
};

export type IEither<S, F = undefined> = Failure<S, F> | Success<S, F>;
