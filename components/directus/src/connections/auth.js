import {createDirectus, graphql, rest, staticToken} from "@directus/sdk";

export function getDirectusClient(directusConnection) {
  const { apiKey, endpoint } = directusConnection.fields;

  let directus = createDirectus(endpoint)//.with(staticToken(apiKey)).with(graphql());
  if (apiKey) {
    directus = directus.with(staticToken(apiKey));
  }
  directus = directus.with(rest()).with(graphql())

  return directus;
}