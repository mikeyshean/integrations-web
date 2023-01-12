import { integationsRouter } from "./routers/integrations";
import { jsonMapperRouter } from "./routers/json-mapper";
import { modelsRouter } from "./routers/models";


export const api = {
  integrations: integationsRouter,
  jsonMapper: jsonMapperRouter,
  models: modelsRouter
}