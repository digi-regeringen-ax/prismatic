import {action} from "@prismatic-io/spectral";
import {getDirectusClient} from "../../connections/auth";
import {
  collectionInput,
  connectionInput,
  fieldsInput,
  filterInput,
  limitInput,
  offsetInput,
  pageInput,
  searchInput,
  sortInput
} from "../../inputs";
import {readFolders, readItems} from "@directus/sdk";
import {buildQueryObject, getDirectusResponse} from "../helpers";

// Action: List All Items
const listFoldersAction = action({
  display: {
    label: "List Folders",
    description: "List all folders that exist in Directus."
  },
  inputs: {
    directusConnection: connectionInput,
    fields: fieldsInput,
    filter: filterInput,
    search: searchInput,
    limit: limitInput,
    sort: sortInput,
    offset: offsetInput,
  },
  perform: async (context, inputs) => {

    const directusClient = getDirectusClient(inputs.directusConnection);
    const queryObject = buildQueryObject(inputs);

    const response = await getDirectusResponse(directusClient, readFolders, null, queryObject);

    return {data: response};
  }
});

export default listFoldersAction;