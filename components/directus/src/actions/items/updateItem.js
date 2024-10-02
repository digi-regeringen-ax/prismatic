import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  dataInput,
  itemIdInput
} from "../../inputs";
import { getDirectusResponse } from "../helpers";
import { updateItem } from "@directus/sdk";

// Action: Update Item
const updateItemAction = action({
  display: {
    label: "Update Item",
    description: "Update an existing item."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    itemId: itemIdInput,
    data: dataInput
  },
  perform: async (context, { directusConnection, collection, itemId, data }) => {
    const directusClient = getDirectusClient(directusConnection);
    const response = await getDirectusResponse(directusClient, updateItem, collection, itemId, data);

    return { data: response };
  }
});

export default updateItemAction;