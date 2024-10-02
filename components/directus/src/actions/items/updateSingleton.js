import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  dataInput
} from "../../inputs";
import { updateSingleton } from "@directus/sdk";
import { getDirectusResponse } from "../helpers";

// Action: Update Singleton
const updateSingletonAction = action({
  display: {
    label: "Update Singleton",
    description: "Update a singleton item in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    data: dataInput
  },
  perform: async (context, { directusConnection, collection, data }) => {
    const directusClient = getDirectusClient(directusConnection);
    const response = await getDirectusResponse(directusClient, updateSingleton, collection, data);

    return { data: response };
  }
});

export default updateSingletonAction;