import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    aliasInput,
    connectionInput,
    deepInput,
    fieldsInput,
    filterInput,
    itemIdInput,
    searchInput,
    versionInput
} from "../../inputs";
import {readFile} from "@directus/sdk";
import {buildQueryObject, getDirectusResponse} from "../helpers";

// Action: List All Items
const readFileAction = action({
    display: {
        label: "Retrieve a File",
        description: "Retrieve a single file by primary key."
    },
    inputs: {
        directusConnection: connectionInput,
        itemId: itemIdInput,
        fields: fieldsInput,
        filter: filterInput,
        search: searchInput,
        alias: aliasInput,
        deep: deepInput,
        version: versionInput
    },
    perform: async (context, inputs) => {
        const directusClient = getDirectusClient(inputs.directusConnection);
        const queryObject = buildQueryObject(inputs);
        const response = await getDirectusResponse(directusClient, readFile, null, inputs.itemId, queryObject);

        return {data: response};
    }
});

export default readFileAction;