import {action, input} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
    connectionInput, fileDataInput,
    fileTitleInput,
    folderInput
} from "../../inputs";
import {uploadFiles} from "@directus/sdk";
import {getDirectusResponse} from "../helpers";
import {createStringInput} from "../../utilities/inputs";

// Action: List All Items
const uploadFileAction = action({
    display: {
        label: "Upload a file",
        description: "Upload a new file."
    },
    inputs: {
        directusConnection: connectionInput,
        title: fileTitleInput,
        data: fileDataInput,
        description: createStringInput({
            label: "Description",
            comments: "Provide a short description of the file",
            required: false,
        }),
        folder: folderInput,
        tags: createStringInput({
            label: "Tags",
            comments: "Tags, limited by semicolon",
            required: false,
        }),
        filename_download: createStringInput({
            label: "Filename",
            comments: "Filename to download",
            required: false,
        })
    },
    perform: async (context, inputs) => {
        const directusClient = getDirectusClient(inputs.directusConnection);

        const formData = new FormData();
        if (inputs.title) {
            formData.append("title", inputs.title);
        } else {
            formData.append("title", inputs.data.name);
        }

        if (inputs.description) formData.append("description", inputs.description);
        if (inputs.filename_download) formData.append("filename_download", inputs.filename_download);
        if (inputs.tags) {
            const tags = inputs.tags.split(";").map(tag => tag.trim());
            formData.append("tags", JSON.stringify(tags));
        }
        if (inputs.folder) formData.append("folder", inputs.folder);
        const file = new Blob([inputs.data]);

        if (inputs.filename_download) {
            formData.append("file", file, inputs.filename_download);
        } else {
            formData.append("file", file, inputs.data.name);
        }
        const response = await getDirectusResponse(directusClient, uploadFiles, null, formData);

        return {data: response};
    }
});

export default uploadFileAction;