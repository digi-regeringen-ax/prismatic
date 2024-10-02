import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  dataInput
} from "../../inputs";
import { getDirectusResponse } from "../helpers";
import { createItems } from "@directus/sdk";

// Action: Create Multiple Items
const createItemsAction = action({
  display: {
    label: "Create Multiple Items",
    description: "Create new items in the given collection."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    data: dataInput
  },
  perform: async (context, { directusConnection, collection, data }) => {
    const directusClient = getDirectusClient(directusConnection);
    if (Array.isArray(data) && data.length) {
      const response = await getDirectusResponse(directusClient, createItems, collection, data);
      return { data: response };
    }
    return { data: [] };
  }
});

export default createItemsAction;