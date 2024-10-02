import { action } from "@prismatic-io/spectral";
import { getDirectusClient } from "../../connections/auth";
import {
  connectionInput,
  filterInput
} from "../../inputs";
import { getDirectusResponse } from "../helpers";

// Action: Delete a fle
const deleteFileByFilterAction = action({
  display: {
    label: "Delete One or More Files",
    description: "Delete one or more files by defining a filter."
  },
  inputs: {
    directusConnection: connectionInput,
    filter: filterInput
  },
  perform: async (context, inputs) => {
    const directusClient = getDirectusClient(inputs.directusConnection);

    const response = await getDirectusResponse(directusClient, deleteFiles, null, inputs.filter);

    return { data: response };
  }
});

export default deleteFileByFilterAction;