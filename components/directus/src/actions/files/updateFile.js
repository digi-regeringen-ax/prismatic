import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    connectionInput,
    fileDataInput,
    fileTitleInput,
    folderInput,
    itemIdInput
} from "../../inputs";
import {readItem} from "@directus/sdk";
import {getDirectusResponse} from "../helpers";

// Action: List All Items
const updateFileAction = action({
    display: {
        label: "Update a File",
        description: "Update an existing file's contents."
    },
    inputs: {
        directusConnection: connectionInput,
        itemId: itemIdInput,
        title: fileTitleInput,
        folder: folderInput,
        data: fileDataInput
    },
    perform: async (context, inputs) => {
        const directusClient = getDirectusClient(inputs.directusConnection);

        const formData = new FormData();
        if (inputs.title) {
            formData.append("title", inputs.title);
        }
        if (inputs.folder) {
            formData.append("folder", inputs.folder);
        }
        const file = new Blob([inputs.data]);
        formData.append("file", file);
        const response = await getDirectusResponse(directusClient, readItem, null, inputs.itemId, formData);

        return {data: response};
    }
});

export default updateFileAction;