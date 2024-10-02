import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  aliasInput,
  collectionInput,
  connectionInput,
  deepInput,
  fieldsInput,
  filterInput,
  itemIdInput,
  searchInput,
  versionInput
} from "../../inputs";
import { readItem } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: List All Items
const getItemAction = action({
  display: {
    label: "Get Item by ID",
    description: "Get an item that exists in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    itemId: itemIdInput,
    fields: fieldsInput,
    filter: filterInput,
    search: searchInput,
    alias: aliasInput,
    deep: deepInput,
    version: versionInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);
    const queryObject = buildQueryObject(inputs);
    const response = await getDirectusResponse(directusClient, readItem, inputs.collection, inputs.itemId, queryObject);

    return { data: response };
  }
});

export default getItemAction;