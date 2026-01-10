import { BusinessRepository } from "../../adapters/out/business.repository";
import { UpdateBusinessConfigDTO } from "../../adapters/in/dtos/business.dto";

export class UpdateBusinessConfigUseCase {
  constructor(private businessRepository: BusinessRepository) {}

  async execute(id: string, userId: string, data: UpdateBusinessConfigDTO) {
    const updatedBusiness = await this.businessRepository.updateConfig(
      id,
      userId,
      data.config
    );

    if (!updatedBusiness) {
      throw new Error("Business not found or unauthorized");
    }

    return updatedBusiness;
  }
}
