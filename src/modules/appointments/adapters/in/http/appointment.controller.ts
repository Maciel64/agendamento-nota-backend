import { Elysia, t } from "elysia";
import { db } from "../../../../infrastructure/drizzle/database";
import { appointments } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { authPlugin } from "../../../../infrastructure/auth/auth-plugin";
import type { User } from "../../../../infrastructure/auth/auth-plugin";

export const appointmentController = new Elysia({ prefix: "/appointments" })
  .use(authPlugin)
  .get("/", async ({ user, set }: { user: User | null; set: any }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const data = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, user.id));

    return data;
  }, {
    auth: true
  })
  .post("/", async ({ user, body, set }: { user: User | null; body: any; set: any }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const newAppointment = await db.insert(appointments).values({
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      userId: user.id,
    }).returning();

    return newAppointment[0];
  }, {
    auth: true,
    body: t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      date: t.String(),
    })
  });
