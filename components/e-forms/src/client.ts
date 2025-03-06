import {Connection, util} from "@prismatic-io/spectral";
import {createClient} from "@prismatic-io/spectral/dist/clients/http";

export const eFormClient = async (connection: Connection) => {
    const {username, password, endpoint} = connection.fields;

    const client = createClient({
        baseUrl: util.types.toString(endpoint)
    });

    const tokenResponse = await client.post(`/token`, {
        user: username,
        password,
    });

    client.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.data}`;
    return client;
};

