import { Elysia } from "elysia";
import { auth } from "./auth";

import { eq } from "drizzle-orm";
import * as schema from "../../../db/schema";
import { db } from "../drizzle/database";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export const authPlugin = new Elysia({ name: "auth-plugin" })
    .derive({ as: 'global' }, async ({ request }) => {
        // Tenta obter o token do header Authorization primeiro
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        let session = await auth.api.getSession({
            headers: request.headers,
        });

        // Caso o Better-Auth não tenha validado com o header padrão, tentamos extrair o token manualmente
        // Conforme solicitado pelo usuário (tratamento de prefixo Bearer)
        if (!session && authHeader?.startsWith('Bearer ')) {
            const tokenOnly = authHeader.substring(7);
            const retryHeaders = new Headers(request.headers);
            retryHeaders.set("Authorization", tokenOnly);

            const retrySession = await auth.api.getSession({
                headers: retryHeaders,
            });

            if (retrySession) {
                console.log(`[AUTH_PLUGIN_DEBUG] Sessão validada com sucesso após remover prefixo 'Bearer ' manualmente.`);
                session = retrySession;
            }
        }

        if (!session && token) {
            console.log(`[AUTH_PLUGIN_DEBUG] getSession retornou NULL, mas existe token: ${token.substring(0, 10)}...`);

            try {
                // Verifica se o token existe no banco
                const sessionInDb = await db.select().from(schema.session).where(eq(schema.session.token, token)).limit(1);
                if (sessionInDb.length > 0) {
                    console.log(`>>> [AUTH_PLUGIN_DEBUG] SUCESSO: Token encontrado no banco via Drizzle. ID: ${sessionInDb[0].id}`);

                    // Se o token existe no banco mas o Better-Auth não o validou, pode ser:
                    // 1. Expiração
                    // 2. Secret divergente
                    // 3. BETTER_AUTH_URL divergente

                    const now = new Date();
                    if (sessionInDb[0].expiresAt < now) {
                        console.warn(`>>> [AUTH_PLUGIN_DEBUG] SESSÃO EXPIRADA: ${sessionInDb[0].expiresAt} < ${now}`);
                    }
                } else {
                    console.warn(`>>> [AUTH_PLUGIN_DEBUG] ERRO: Token não encontrado na tabela 'session'.`);
                }
            } catch (err) {
                console.error(`>>> [AUTH_PLUGIN_DEBUG] Erro ao consultar banco:`, err);
            }
        }

        if (session) {
            console.log(`[AUTH_PLUGIN_DEBUG] Sessão validada para: ${session.user.email}`);
        }

        return {
            user: session?.user ?? null,
            session: session?.session ?? null,
        };
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
