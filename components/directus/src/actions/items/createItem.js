import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  dataInput
} from "../../inputs";
import { createItem } from "@directus/sdk";
import { getDirectusResponse } from "../helpers";

// Action: Create Item
const createItemAction = action({
  display: {
    label: "Create an Item",
    description: "Create a new item in the given collection.."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    data: dataInput
  },
  perform: async (context, { directusConnection, collection, data }) => {
    const directusClient = getDirectusClient(directusConnection);
    const response = await getDirectusResponse(directusClient, createItem, collection, data);

    return { data: response };
  }
});

export default createItemAction;