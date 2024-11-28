import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  connectionInput,
  itemIdInput
} from "../../inputs";
import { deleteFile, readItem } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: Delete a fle
const deleteFileAction = action({
  display: {
    label: "Delete a File",
    description: "Delete an existing file."
  },
  inputs: {
    directusConnection: connectionInput,
    itemId: itemIdInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);

    const response = await getDirectusResponse(directusClient, deleteFile, null, inputs.itemId);

    return { data: response };
  }
});

export default deleteFileAction;