import { Elysia, t } from "elysia";
import { authPlugin } from "../../../../infrastructure/auth/auth-plugin";
import { BusinessRepository } from "../../out/business.repository";
import { ListMyBusinessesUseCase } from "../../../application/use-cases/list-my-businesses.use-case";
import { CreateBusinessUseCase } from "../../../application/use-cases/create-business.use-case";
import { UpdateBusinessConfigUseCase } from "../../../application/use-cases/update-business-config.use-case";
import { createBusinessDTO, updateBusinessConfigDTO } from "../dtos/business.dto";

const businessRepository = new BusinessRepository();
const listMyBusinessesUseCase = new ListMyBusinessesUseCase(businessRepository);
const createBusinessUseCase = new CreateBusinessUseCase(businessRepository);
const updateBusinessConfigUseCase = new UpdateBusinessConfigUseCase(businessRepository);

export const businessController = new Elysia({ prefix: "/api/business" })
  .use(authPlugin)
  .onBeforeHandle(({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .get("/my", async ({ user }) => {
    return await listMyBusinessesUseCase.execute(user!.id);
  })
  .post("/", async ({ user, body, set }) => {
    try {
      return await createBusinessUseCase.execute(user!.id, body);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  }, {
    body: createBusinessDTO
  })
  .patch("/:id/config", async ({ user, params: { id }, body, set }) => {
    try {
      return await updateBusinessConfigUseCase.execute(id, user!.id, body);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message };
    }
  }, {
    body: updateBusinessConfigDTO,
    params: t.Object({
      id: t.String()
    })
  });
