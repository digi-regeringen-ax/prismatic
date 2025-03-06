import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    connectionInput, fileDataInput,
    fileTitleInput,
    folderInput
} from "../../inputs";
import {uploadFiles} from "@directus/sdk";
import {getDirectusResponse} from "../helpers";

// Action: List All Items
const uploadFileAction = action({
    display: {
        label: "Upload a File",
        description: "Upload a new file."
    },
    inputs: {
        directusConnection: connectionInput,
        title: fileTitleInput,
        data: fileDataInput,
        folder: folderInput
    },
    perform: async (context, inputs) => {
        const directusClient = getDirectusClient(inputs.directusConnection);

        const formData = new FormData();
        formData.append("title", inputs.title);
        if (inputs.folder) formData.append("folder", inputs.folder);
        const file = new Blob([inputs.data]);
        formData.append("file", file);
        console.log(inputs.data);
        const response = await getDirectusResponse(directusClient, uploadFiles, null, formData);

        return {data: response};
    }
});

export default uploadFileAction;