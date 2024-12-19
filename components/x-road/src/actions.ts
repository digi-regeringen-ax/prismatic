import axios, {AxiosResponse, Method, ResponseType} from "axios";
import {action, input, util} from "@prismatic-io/spectral";

// Define supported HTTP methods and response types
const supportedMethods: Method[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const supportedResponseTypes: ResponseType[] = ["json", "text", "arraybuffer"];
import objectSizeof from "object-sizeof";

// Define inputs for the HTTP client

const xRoadConnectionInput = input({
    label: "X-Road Connection",
    type: "connection",
    required: true
});

const xRoadEndpointInput = input({
    label: "Endpoint",
    type: "string",
    required: true,
    clean: (value) => util.types.toString(value),
});

const debugRequest = input({
    label: "Debug Request",
    type: "boolean",
    required: false,
    comments: "Enabling this flag will log out the current request.",
    clean: (value) => util.types.toBool(value),
});

const method = input({
    label: "Method",
    type: "string",
    required: true,
    model: supportedMethods.map((method) => ({label: method, value: method})),
    comments: "The HTTP method to use.",
});

const headers = input({
    label: "Headers",
    type: "string",
    collection: "keyvaluelist",
    required: false,
    comments: "Headers to include in the request.",
});

const queryParams = input({
    label: "Query Parameters",
    type: "string",
    collection: "keyvaluelist",
    required: false,
    comments: "Query parameters to include in the request.",
});

const data = input({
    label: "Data",
    type: "string",
    required: false,
    comments: "The body data to send with the request.",
});

const responseType = input({
    label: "Response Type",
    type: "string",
    required: true,
    model: supportedResponseTypes.map((type) => ({label: type, value: type})),
    comments: "The expected response type.",
});

// Create the HTTP client
const createClient = ({baseUrl, headers, timeout, params, responseType}: {
    baseUrl: string,
    headers: Record<string, string>,
    timeout: number,
    params: Record<string, string>,
    responseType: ResponseType,
    debugRequest: boolean
}) => {
    const client = axios.create({
        baseURL: baseUrl,
        headers,
        timeout,
        params,
        responseType,
        maxContentLength: Number.POSITIVE_INFINITY,
        maxBodyLength: Number.POSITIVE_INFINITY,
    });

    if (debugRequest) {
        client.interceptors.request.use((request) => {
            const {baseURL, headers, method, timeout, url, data, params} = request;
            const dataSize = objectSizeof(data);
            console.log(
                util.types.toJSON(
                    {
                        type: "request",
                        baseURL,
                        params,
                        url,
                        headers,
                        method,
                        timeout,
                        data:
                            dataSize > 1024 * 10 || Buffer.isBuffer(data) ? `<data (${dataSize} bytes)>` : data,
                    },
                    true,
                    true,
                ),
            );
            return request;
        });

        client.interceptors.response.use((response) => {
            const {headers, status, statusText, data} = response;
            const dataSize = objectSizeof(data);
            console.log(
                util.types.toJSON(
                    {
                        type: "response",
                        headers,
                        status,
                        statusText,
                        data:
                            dataSize > 1024 * 10 || Buffer.isBuffer(data) ? `<data (${dataSize} bytes)>` : data,
                    },
                    true,
                    true,
                ),
            );
            return response;
        });
    }

    return client;
};

// Define the action to perform the HTTP request
export const httpRequestAction = action({
    display: {
        label: "HTTP Request",
        description: "Send an HTTP request and return the response.",
    },
    inputs: {
        xRoadConnectionInput,
        xRoadEndpointInput,
        method,
        headers,
        queryParams,
        data,
        responseType,
        debugRequest
    },
    perform: async (_context, {
        xRoadConnectionInput,
        xRoadEndpointInput,
        method,
        headers,
        queryParams,
        data,
        responseType,
        debugRequest
    }): Promise<any> => {

        const requested_headers = util.types.keyValPairListToObject(headers)
        const x_road_headers = {
            "X-Road-Client": `${xRoadConnectionInput.fields.xRoadClientPhrase as string}`
        }
        const merged_headers = {...requested_headers, ...x_road_headers};

        const baseUrl = [xRoadConnectionInput.fields.xRoadSecurityServerUrl as string,
            xRoadConnectionInput.fields.xRoadProviderMemberClass as string,
            xRoadConnectionInput.fields.xRoadProviderMemberCode as string,
            xRoadConnectionInput.fields.xRoadProviderSubsystemCode as string,
            xRoadConnectionInput.fields.xRoadProviderServiceCode as string,
        ].join("/")

        const client = createClient({
            baseUrl,
            headers: merged_headers,
            params: util.types.keyValPairListToObject(queryParams),
            timeout: 5000,
            responseType: responseType as ResponseType,
            debugRequest: debugRequest || false
        });

        try {
            const response: AxiosResponse = await client.request({
                method: method as string,
                url: xRoadEndpointInput as string,
                data,
            });
            return {data: response.data};
        } catch (error: any) {
            return {error: error.message};
        }
    }
});

export default {httpRequestAction};