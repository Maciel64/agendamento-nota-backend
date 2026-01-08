import { SigninDTO } from "../dtos/signin.dto";

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async signin(data: SigninDTO) {}
}
