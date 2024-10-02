import {input, util} from "@prismatic-io/spectral";
import { isJsonString } from "../utilities/types";
import {createJsonInput, createStringInput} from "../utilities/inputs";

export const connectionInput = input({
    label: "Directus instance",
    required: true,
    type: "connection"
});

export const itemIdInput = createStringInput({
    label: "Item ID",
    comments: "Provide the id of the item",
    required: true
});

export const collectionInput = createStringInput({
    label: "Collection",
    comments: "Name of the collection to interact with",
    required: true
});

export const fieldsInput = createJsonInput({
    label: "Fields",
    required: false,
    defaultValue: ["*"],
    mustBeArray: true,
    comments: "Choose the fields that are returned in the current dataset. This parameter supports dot notation to request nested relational fields. You can also use a wildcard (*) to include all fields at a specific depth.",
    clean: (value) => {
        if (isJsonString(value)) {
            return JSON.parse(value);
        }
        if (!value) {
            return ["*"];
        }
        if (!Array.isArray(value)) {
            return [value];
        }
        return value;
    }
});

export const dataInput = createJsonInput({
    label: "Data",
    required: true,
    defaultValue: {}
});

export const aliasInput = createJsonInput({
    label: "Aliases",
    defaultValue: {},
    comments: "Aliases allow you rename fields on the fly, and request the same nested data set multiple times using different filters.",
    required: false
});

export const deepInput = createJsonInput({
    label: "Deep",
    required: false,
    defaultValue: {},
    comments: "Deep allows you to set any of the other query parameters on a nested relational dataset."
});

export const sortInput = createJsonInput({
    label: "Sort",
    required: false,
    mustBeArray: true,
    defaultValue: [],
    comments: "What field(s) to sort by. Sorting defaults to ascending, but a minus sign (-) can be used to reverse this to descending order."
});

export const offsetInput = createStringInput({
    label: "Offset",
    comments: "Skip the first n items in the response. Can be used for pagination.",
    defaultValue: 0,
    required: false,
    clean: (value) => util.types.toNumber(value)
});

export const pageInput = createStringInput({
    label: "Page",
    comments: "An alternative to offset. Page is a way to set offset under the hood by calculating limit * page. Page is 1-indexed.",
    defaultValue: "0",
    clean: (value) => util.types.toNumber(value)
});

export const limitInput = createStringInput({
    label: "Limit",
    comments: "Limits the output.",
    defaultValue: "-1",
    required: false,
    clean: (value) => util.types.toNumber(value)
});

export const searchInput = createStringInput({
    label: "Search",
    required: false,
    comments: "The search parameter allows you to perform a search on textual and numeric type fields within a collection."
});

export const filterInput = createJsonInput({
    label: "Filter",
    required: false,
    comments: "Define the filter object according to Directus' documentation."
});

export const queryInput = createJsonInput({
    label: "Query",
    required: false,
    comments: "Define the query object according to Directus' documentation."
});

export const versionInput = createStringInput({
    label: "Version",
    required: false,
    comments: "The version parameter is used to retrieve a singleton's state from a specific Content Version. The value corresponds to the key of the Content Version."
});

// Example usage of itemArrayInput for an array-based input
export const keysInput = createJsonInput({
    label: "Keys",
    required: false,
    comments: "An array of keys.",
    defaultValue: [],
    mustBeArray: true
});

export const fileTitleInput = createStringInput({
    label: "Title of file",
    required: true,
    comments: "The title for the file."
});

export const folderInput = createStringInput({
    label: "UUID for folder",
    required: false,
    comments: "UUID for the folder.",
    default: "",
    clean: (value) => {
        if (value === "") return null;
        return value;
    }
});

export const fileDataInput = createStringInput({
    label: "Data for file",
    required: true,
    comments: "The contents of the file."
});

export const importFromUrlInput = createStringInput({
    label: "URL",
    required: true,
    comments: "The URL to download the file from."
});