import type {Connection} from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";

export const createClientWrapper = (connection: Connection) => {
    // Create a client using the provided Connection for the
    // service you're consuming from this Component.

    const client = createClient({
        baseUrl: connection.fields.x_road_security_server_url as string,
        debug: true,
        headers: {
            Accept: "application/json",
            "X-Road-Client": `${connection.fields.x_road_client as string}`
        }
    })

    return client;
};


