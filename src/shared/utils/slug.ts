import { db } from "../../modules/infrastructure/drizzle/database";
import { business } from "../../db/schema";
import { eq } from "drizzle-orm";

export function createSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select()
      .from(business)
      .where(eq(business.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
