import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  aliasInput,
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
import { readFiles } from "@directus/sdk";
import { buildQueryObject, getDirectusResponse } from "../helpers";

// Action: List All Files
const listFilesAction = action({
  display: {
    label: "List Files",
    description: "List all files that exist in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
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

    const response = await getDirectusResponse(directusClient, readFiles, null, queryObject);

    return { data: response };
  }
});

export default listFilesAction;