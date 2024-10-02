import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  aliasInput,
  collectionInput,
  connectionInput,
  deepInput,
  fieldsInput,
  versionInput
} from "../../inputs";
import { readSingleton } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: Get Singleton
const getSingletonAction=  action({
  display: {
    label: "Get Singleton",
    description: "List a singleton item in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    fields: fieldsInput,
    alias: aliasInput,
    deep: deepInput,
    version: versionInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);
    const queryObject = buildQueryObject(inputs);

    const response = await getDirectusResponse(directusClient, readSingleton, inputs.collection, queryObject);

    return { data: response };
  }
});

export default getSingletonAction;
