import { db } from "../../../infrastructure/drizzle/database";
import { business } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";

export class BusinessRepository {
  async findAllByUserId(userId: string) {
    return await db
      .select({
        id: business.id,
        name: business.name,
        slug: business.slug,
        config: business.config,
        createdAt: business.createdAt,
      })
      .from(business)
      .where(eq(business.userId, userId));
  }

  async findBySlug(slug: string) {
    const result = await db
      .select()
      .from(business)
      .where(eq(business.slug, slug))
      .limit(1);
    return result[0] || null;
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(business)
      .where(eq(business.id, id))
      .limit(1);
    return result[0] || null;
  }

  async create(data: typeof business.$inferInsert) {
    const result = await db.insert(business).values(data).returning();
    return result[0];
  }

  async updateConfig(id: string, userId: string, config: any) {
    const result = await db
      .update(business)
      .set({ config })
      .where(and(eq(business.id, id), eq(business.userId, userId)))
      .returning();
    return result[0] || null;
  }
}
