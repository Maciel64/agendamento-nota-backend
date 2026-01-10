import { t } from "elysia";

export const createBusinessDTO = t.Object({
  name: t.String(),
  slug: t.String(),
});

export const updateBusinessConfigDTO = t.Object({
  config: t.Object({
    hero: t.Object({
      title: t.String(),
    }),
    theme: t.Object({
      primaryColor: t.String(),
    }),
    services: t.Optional(t.Array(t.Any())),
  }),
});

export type CreateBusinessDTO = typeof createBusinessDTO.static;
export type UpdateBusinessConfigDTO = typeof updateBusinessConfigDTO.static;
