import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  itemIdInput
} from "../../inputs";
import { deleteItem } from "@directus/sdk";
import { getDirectusResponse } from "../helpers";

// Action: Delete Item
const deleteItemAction = action({
  display: {
    label: "Delete Item",
    description: "Delete an existing item."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    itemId: itemIdInput
  },
  perform: async (context, { directusConnection, collection, itemId }) => {
    const directusClient = getDirectusClient(directusConnection);
    const response = await getDirectusResponse(directusClient, deleteItem, collection, itemId);

    return { data: response };
  }
});

export default deleteItemAction;