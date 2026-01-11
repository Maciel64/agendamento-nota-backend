import { StudiosRepository } from "../../adapters/out/studios.repository";

export class GetStudioBySlugUseCase {
    constructor(private readonly studiosRepository: StudiosRepository) { }

    async execute(slug: string) {


        const studio = await this.studiosRepository.findBySlug(slug);

        if (!studio) {
            throw new Error("Studio not found");
        }

        return studio;
    }
}


