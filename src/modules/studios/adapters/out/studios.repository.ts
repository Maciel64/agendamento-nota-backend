import { db } from "../../../infrastructure/drizzle/database";
import { studios, business } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export class StudiosRepository {
  async findBySlug(slug: string) {
    const [record] = await db
      .select({
        id: studios.id,
        name: studios.name,
        slug: studios.slug,
        ownerId: studios.ownerId,
        config: business.config,
        createdAt: studios.createdAt,
        updatedAt: studios.updatedAt,
      })
      .from(studios)
      .leftJoin(business, eq(studios.slug, business.slug))
      .where(eq(studios.slug, slug))
      .limit(1);
    return record ?? null;
  }

  async findById(id: string) {
    const [record] = await db
      .select()
      .from(studios)
      .where(eq(studios.id, id))
      .limit(1);
    return record ?? null;
  }
}
