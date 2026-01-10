import { Elysia } from "elysia";
import { auth } from "./auth";

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export const authPlugin = new Elysia({ name: "auth-plugin" })
    .derive({ as: 'global' }, async ({ request }) => {
        // Tenta obter o token do header Authorization primeiro
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session && token) {
            // Se não encontrou via cookie mas tem token, o Better-Auth já deve ter processado via headers no getSession
            // Mas adicionamos log para depuração
            console.log(`[AUTH_DEBUG] Tentando validar via Token: ${token.substring(0, 10)}...`);
        }

        if (!session) {
            const url = new URL(request.url);
            console.log(`[AUTH_DEBUG] Nenhuma sessão ativa encontrada para: ${url.pathname}`);
        } else {
            console.log(`[AUTH_DEBUG] Sessão validada para: ${session.user.email}`);
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
