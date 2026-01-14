import { db } from "../../../../infrastructure/drizzle/database";
import { companies } from "../../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { IBusinessRepository } from "../../../domain/ports/business.repository";
import { Business, BusinessSummary, CreateBusinessInput } from "../../../domain/entities/business.entity";

export class DrizzleBusinessRepository implements IBusinessRepository {
  async findAllByUserId(userId: string): Promise<BusinessSummary[]> {
    return await db
      .select({
        id: companies.id,
        name: companies.name,
        slug: companies.slug,
        siteCustomization: companies.siteCustomization,
        createdAt: companies.createdAt,
      })
      .from(companies)
      .where(eq(companies.ownerId, userId));
  }

  async findBySlug(slug: string): Promise<Business | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);
    
    if (!result[0]) return null;

    return result[0];
  }

  async findById(id: string): Promise<Business | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!result[0]) return null;

    return result[0];
  }

  async create(data: CreateBusinessInput): Promise<Business> {
    const result = await db.insert(companies).values({
      id: data.id,
      name: data.name,
      slug: data.slug,
      ownerId: data.ownerId,
      siteCustomization: data.siteCustomization
    }).returning();

    return result[0];
  }

  async updateConfig(id: string, userId: string, config: any): Promise<Business | null> {
    const result = await db
      .update(companies)
      .set({ siteCustomization: config })
      .where(and(eq(companies.id, id), eq(companies.ownerId, userId)))
      .returning();
    
    if (!result[0]) return null;

    return result[0];
  }
}
