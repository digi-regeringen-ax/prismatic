import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  connectionInput,
  dataInput,
  itemIdInput
} from "../../inputs";
import { readItem } from "@directus/sdk";
import {  getDirectusResponse } from "../helpers";

// Action: List All Items
const updateFileMetaData = action({
  display: {
    label: "Update a File -- meta data only",
    description: "Update the meta data of a file."
  },
  inputs: {
    directusConnection: connectionInput,
    itemId: itemIdInput,
    data: dataInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);


    const response = await getDirectusResponse(directusClient, readItem, null, inputs.itemId, inputs.data);

    return { data: response };
  }
});

export default updateFileMetaData;