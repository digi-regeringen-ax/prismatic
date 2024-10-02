import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  connectionInput,
  fileTitleInput,
  folderInput, importFromUrlInput
} from "../../inputs";
import { importFile } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: List All Items
const importFileAction = action({
  display: {
    label: "Import a File",
    description: "Import a new file from a given URL."
  },
  inputs: {
    directusConnection: connectionInput,
    title: fileTitleInput,
    url: importFromUrlInput,
    folder: folderInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);
    const queryObject = buildQueryObject(inputs);
    delete queryObject.url;

    const response = await getDirectusResponse(directusClient, importFile, null, inputs.url, queryObject);

    return { data: response };
  }
});

export default importFileAction;