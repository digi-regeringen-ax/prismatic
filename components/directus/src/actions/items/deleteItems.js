import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    collectionInput,
    connectionInput,
    keysInput, queryInput
} from "../../inputs";
import {deleteItems} from "@directus/sdk";
import {getDirectusResponse} from "../helpers";

// Action: Delete Multiple Items
const deleteItemsAction = action({
    display: {
        label: "Delete Multiple Items",
        description: "Delete multiple existing items."
    },
    inputs: {
        directusConnection: connectionInput,
        collection: collectionInput,
        itemIds: keysInput,
        query: queryInput
    },
    perform: async (context, {directusConnection, collection, itemIds, query}) => {
        const directusClient = getDirectusClient(directusConnection);

        let keysOrQuery = [];

        if (itemIds.length > 0) { // Check if itemIds array is not empty
            keysOrQuery = itemIds;
        } else if (Object.keys(query).length > 0) { // Check if query object has any properties
            keysOrQuery = query;
        }

        // Only run the response line if target is not empty
        if (keysOrQuery.length > 0 || Object.keys(keysOrQuery).length > 0) {
            const response = await getDirectusResponse(directusClient, deleteItems, collection, keysOrQuery);
            return {data: response};
        }
        return {data: {}};
    }
});
deleteItems('...',)

export default deleteItemsAction;