import { connection } from "@prismatic-io/spectral";

// Create a connection that contains an API endpoint URL
// and an API key.
export const apiKeyConnection = connection({
  key: "apiKey",
  label: "Directus Connection",
  comments: "Directus Connection",
  inputs: {
    endpoint: {
      label: "Directus Endpoint URL",
      placeholder: "Directus Endpoint URL",
      type: "string",
      required: true,
      comments: "Directus API Endpoint URL",
      default:
        "https://base.gov.ax",
      example: "https://my-company.api.directus.com/",
    },
    apiKey: {
      label: "Directus API Key",
      placeholder: "Acme API Key",
      type: "string",
      required: false,
    },
  },
});

export default [apiKeyConnection];