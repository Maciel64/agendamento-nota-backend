import { Elysia } from "elysia";
import { auth } from "./auth";

import { eq } from "drizzle-orm";
import * as schema from "../../../db/schema";
import { db } from "../drizzle/database";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export const authPlugin = new Elysia({ name: "auth-plugin" })
    .derive({ as: 'global' }, async ({ request }) => {
        try {
            // Tenta obter o token do Header Authorization caso não esteja nos cookies
            const authHeader = request.headers.get("authorization");
            const headers = new Headers(request.headers);

            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                // Se temos um Bearer token mas não temos o cookie correspondente, 
                // podemos injetar o cookie manualmente para o Better Auth processar
                if (!headers.get("cookie")?.includes("better-auth.sessionToken")) {
                    headers.append("cookie", `better-auth.sessionToken=${token}`);
                }
            }

            const session = await auth.api.getSession({
                headers: headers,
            });

            if (session) {
                console.log(`[AUTH_PLUGIN] Sessão validada para: ${session.user.email} (${authHeader ? 'Header' : 'Cookie'})`);
            }

            return {
                user: session?.user ?? null,
                session: session?.session ?? null,
            };
        } catch (error) {
            console.error("[AUTH_PLUGIN] Erro ao obter sessão:", error);
            return {
                user: null,
                session: null,
            };
        }
    })
    .macro({
        auth: {
            resolve({ user, set }) {
                if (!user) {
                    set.status = 401;
                    return { error: "Unauthorized" };
                }
            },
        },
    });
