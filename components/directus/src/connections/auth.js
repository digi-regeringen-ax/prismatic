import { createDirectus, graphql, rest, staticToken } from "@directus/sdk";

/**
 * Creates and configures a Directus client instance.
 *
 * @param {Object} directusConnection - The connection details for Directus.
 * @param {Object} directusConnection.fields - The fields containing connection details.
 * @param {string} directusConnection.fields.apiKey - The API key for authentication.
 * @param {string} directusConnection.fields.endpoint - The endpoint URL for the Directus instance.
 * @returns {Object} - The configured Directus client instance.
 */
export function getDirectusClient(directusConnection) {
    const { apiKey, endpoint } = directusConnection.fields;
    let directus = createDirectus(endpoint);

    if (apiKey) {
        directus = directus.with(staticToken(apiKey));
    }

    return directus.with(rest()).with(graphql());
}