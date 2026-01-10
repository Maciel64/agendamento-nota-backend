import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/database";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  url: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://lucas-studio.localhost:3000",
    "http://*.localhost:3000",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.PLATFORM_URL ? [process.env.PLATFORM_URL] : []),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    useSecureCookies: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    {
      id: "business-data",
      endpoints: {
        getBusiness: {
          path: "/business-info",
          method: "GET",
          useSession: true,
          handler: async (ctx) => {
            console.log(`[AUTH_PLUGIN] getBusiness chamado para usuário: ${ctx.session.user.id}`);
            const userId = ctx.session.user.id;
            const [userBusiness] = await db
              .select()
              .from(schema.business)
              .where(eq(schema.business.userId, userId))
              .limit(1);
            
            if (!userBusiness) {
              console.log(`[AUTH_PLUGIN] Nenhum negócio encontrado para o usuário: ${userId}`);
            }

            return {
              business: userBusiness || null,
              slug: userBusiness?.slug || null,
            };
          },
        },
      },
    },
  ],
});
