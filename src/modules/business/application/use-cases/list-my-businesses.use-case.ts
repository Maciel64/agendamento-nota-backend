import { BusinessRepository } from "../../adapters/out/business.repository";

export class ListMyBusinessesUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(userId: string) {
    return await this.businessRepository.findAllByUserId(userId);
  }
}
