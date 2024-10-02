import {action, input} from "@prismatic-io/spectral";
import {getDirectusClient} from "../connections/auth";
import {connectionInput} from "../inputs";
import * as DirectusSDK from "@directus/sdk";
import {isJsonString} from "../utilities/types";

const genericCallToSDKAction = action({
    display: {
        label: "Generic call to SDK",
        description: "Call a function, pass values accordingly to SDKs documentation."
    },
    inputs: {
        directusConnection: connectionInput,
        functionName: input({
            label: "Function name",
            comments: "Name of the function to call",
            required: true,
            type: "string",
            clean: (value) => {
                if (typeof value === 'string' && typeof DirectusSDK[value] !== undefined) {
                    return value;
                }
                throw new Error(`The first value, "${value}" must be a valid function name`);
            }
        }),
        parameters: input({
            label: "Parameters",
            type: "string",
            collection: "valuelist",
            required: true,

        })
    },
    perform: async (context, {directusConnection, functionName, parameters}) => {
        const directusClient = getDirectusClient(directusConnection);
        const paramsForFunction = parameters.map(item => {

            if (typeof item === 'string') {
                const trimmedItem = item.trim();
                // Check for boolean
                if (trimmedItem.toLowerCase() === 'true') return true;
                if (trimmedItem.toLowerCase() === 'false') return false;

                // Check for array or object
                if (isJsonString(trimmedItem)) {
                    const parsedValue = JSON.parse(trimmedItem);
                    if(typeof parsedValue === 'number') return trimmedItem; // return as string instead, if "076".
                    return JSON.parse(parsedValue);
                }
                return trimmedItem;
            }

            return item;
        });

        const response = await directusClient.request(DirectusSDK.withSearch(DirectusSDK[functionName](...paramsForFunction)));
        return {data: response};
    }
});

export default genericCallToSDKAction;