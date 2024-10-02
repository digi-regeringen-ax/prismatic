import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  aliasInput,
  collectionInput,
  connectionInput,
  deepInput,
  fieldsInput,
  filterInput,
  limitInput,
  offsetInput,
  pageInput,
  searchInput,
  sortInput
} from "../../inputs";
import { readItems } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: List All Items
const getItemsAction = action({
  display: {
    label: "Get Items",
    description: "List all items that exist in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
    collection: collectionInput,
    fields: fieldsInput,
    filter: filterInput,
    search: searchInput,
    limit: limitInput,
    sort: sortInput,
    page: pageInput,
    offset: offsetInput,
    alias: aliasInput,
    deep: deepInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);
    const queryObject = buildQueryObject(inputs);

    const response = await getDirectusResponse(directusClient, readItems, inputs.collection, queryObject);

    return { data: response };
  }
});

export default getItemsAction;