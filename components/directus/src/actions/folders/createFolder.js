import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    collectionInput,
    connectionInput,
    dataInput,
} from "../../inputs";
import {createFolder} from "@directus/sdk";
import {buildQueryObject, getDirectusResponse} from "../helpers";
import {createStringInput} from "../../utilities/inputs";

// Action: Create Item
const createFolderAction = action({
    display: {
        label: "Create a Folder",
        description: "Create a new (virtual) folder."
    },
    inputs: {
        directusConnection: connectionInput,
        name: createStringInput({
            label: "Name",
            comments: "Name of the folder to create",
            required: true
        }),
        parent: createStringInput({
            label: "Parent",
            comments: "UUID of parent folder",
            required: false
        })
    },
    perform: async (context, inputs) => {
        const directusClient = getDirectusClient(inputs.directusConnection);
        if (inputs.parent === '') inputs.parent = null;
        const queryObject = buildQueryObject(inputs);
        console.log(queryObject);
        const response = await getDirectusResponse(directusClient, createFolder, null, queryObject);
        return {data: response};
    }
});

export default createFolderAction;