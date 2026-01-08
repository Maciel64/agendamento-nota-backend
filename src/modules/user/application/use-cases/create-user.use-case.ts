import { SigninDTO } from "../../adapters/in/dtos/signin.dto";
import { UserRepository } from "../../adapters/out/user.repository";
import { UserAlreadyExistsError } from "../../domain/error/user-already-exists.error";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(data: SigninDTO) {
    const alreadyExists = await this.userRepository.findByEmail(data.email);

    if (alreadyExists) throw new UserAlreadyExistsError();

    await this.userRepository.create({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
