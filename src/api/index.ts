import { integationsRouter } from "./routers/integrations";
import { jsonMapperRouter } from "./routers/json-mapper";


export const api = {
  integrations: integationsRouter,
  jsonMapper: jsonMapperRouter
}