/* eslint-disable max-classes-per-file */

export class DbError extends Error {
  constructor(message?: string) {
    super(message ?? 'DB Error');
  }
}

export class DbNotFoundError extends DbError {
  constructor(message?: string) {
    super(message ?? 'DB Not Found Error');
  }
}
