// Helper function to add a property to query_object if it exists in inputs
import {util} from "@prismatic-io/spectral";
import {isJsonString} from "../utilities/types"
import {withSearch} from "@directus/sdk";

export const addToQueryObject = (queryObject, key, value, isJson = false) => {
    if (isJson && typeof value === "string") {
        value = isJsonString(value) ? JSON.parse(value) : null;
    }
    queryObject[key] = value;
};

// Optimized reusable function to dynamically build the query object based on provided inputs
export const buildQueryObject = (inputs) => Object.entries(inputs).reduce(
    (queryObject, [key, value]) => {
        const isJsonKey = ["fields", "deep", "alias", "filter"].includes(key);
        const isNumberKey = key === "limit";
        addToQueryObject(queryObject, key, isNumberKey ? util.types.toNumber(value) : value, isJsonKey);

        delete queryObject.directusConnection;
        return queryObject;
    }, {});

// Optimized duplicate Directus client retrieval with function
export const getDirectusResponse = async (directusClient, method, collection, ...args) => {

    if (collection) {
        return directusClient.request(withSearch(method(collection, ...args)));
    }
    return directusClient.request(withSearch(method(...args)));

};

export default {
    addToQueryObject,
    buildQueryObject,
    getDirectusResponse
};