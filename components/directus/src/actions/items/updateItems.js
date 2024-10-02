import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    collectionInput,
    connectionInput, dataInput, filterInput, keysInput
} from "../../inputs";
import {getDirectusResponse} from "../helpers";
import {updateItems} from "@directus/sdk";

// Action: Update Multiple Items
const updateItemsAction = action({
    display: {
        label: "Update Multiple Items",
        description: "Update multiple items at once."
    },
    inputs: {
        directusConnection: connectionInput,
        collection: collectionInput,
        itemIds: keysInput,
        data: dataInput,
        filter: filterInput
    },
    perform: async (context, {directusConnection, collection, itemIds, data, filter}) => {
        const directusClient = getDirectusClient(directusConnection);
        const target = itemIds && Array.isArray(itemIds) && itemIds.length ? itemIds : filter;
        console.log(target, typeof target)
        const response = await getDirectusResponse(directusClient, updateItems, collection, target, data);

        return {data: response};
    }
});

export default updateItemsAction;