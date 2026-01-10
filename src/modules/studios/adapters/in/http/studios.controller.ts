import { Elysia, t } from "elysia";
import { StudiosRepository } from "../../out/studios.repository";

const studiosRepository = new StudiosRepository();

export const studiosController = new Elysia({ prefix: "/api/studios" })
  .get("/slug/:slug", async ({ params: { slug }, set }) => {
    console.log(`[STUDIO_FETCH] Buscando dados para o slug: ${slug}`);
    const studio = await studiosRepository.findBySlug(slug);

    if (!studio) {
      set.status = 404;
      return { error: "Studio not found" };
    }

    return studio;
  }, {
    params: t.Object({
      slug: t.String()
    })
  });
