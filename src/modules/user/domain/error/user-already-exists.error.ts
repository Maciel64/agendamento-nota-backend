export class UserAlreadyExistsError extends Error {
  constructor() {
    super(`User with already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}
