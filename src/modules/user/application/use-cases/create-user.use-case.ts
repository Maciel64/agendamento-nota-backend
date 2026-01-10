import { SigninDTO } from "../../adapters/in/dtos/signin.dto";
import { UserRepository } from "../../adapters/out/user.repository";
import { UserAlreadyExistsError } from "../../domain/error/user-already-exists.error";
import { auth } from "../../../infrastructure/auth/auth";
import { db } from "../../../infrastructure/drizzle/database";
import { business, studios } from "../../../../db/schema";
import { generateUniqueSlug } from "../../../../shared/utils/slug";
import { eq } from "drizzle-orm";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) { }
  async execute(data: SigninDTO) {
    const alreadyExists = await this.userRepository.findByEmail(data.email);

    if (alreadyExists) {
      // Verificar se o usuário já tem um business
      const userBusiness = await db
        .select()
        .from(business)
        .where(eq(business.userId, alreadyExists.id))
        .limit(1);

      if (userBusiness.length > 0) {
        return {
          user: alreadyExists,
          session: null,
          business: userBusiness[0],
          slug: userBusiness[0].slug
        };
      }

      // Se o usuário existe mas não tem business, vamos apenas criar o business e studio para ele
      const slug = await generateUniqueSlug(data.studioName);

      const [newBusiness] = await db.insert(business).values({
        id: crypto.randomUUID(),
        name: data.studioName,
        slug: slug,
        userId: alreadyExists.id,
        config: {
          hero: { title: "Novo Site" },
          theme: { primaryColor: "#000" },
          services: [],
        },
      }).returning();

      await db.insert(studios).values({
        id: crypto.randomUUID(),
        name: data.studioName,
        slug: slug,
        ownerId: alreadyExists.id,
      });

      return {
        user: alreadyExists,
        session: null,
        business: newBusiness,
        slug: slug
      };
    }

    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    if (!response || !response.user) {
      throw new Error("Failed to create user");
    }

    const slug = await generateUniqueSlug(data.studioName);

    const [newBusiness] = await db.insert(business).values({
      id: crypto.randomUUID(),
      name: data.studioName,
      slug: slug,
      userId: response.user.id,
      config: {
        hero: { title: "Novo Site" },
        theme: { primaryColor: "#000" },
        services: [],
      },
    }).returning();

    await db.insert(studios).values({
      id: crypto.randomUUID(),
      name: data.studioName,
      slug: slug,
      ownerId: response.user.id,
    });

    return {
      ...response,
      business: newBusiness,
      slug: slug
    };
  }
}
