import {createJsonInput} from "../utilities/inputs";

// Define input configurations
export const incomingArrInput = createJsonInput({
    label: "New array",
    comments: "Collection of new data items.",
    required: true,
    defaultValue: [],
    mustBeArray: true
});

export const existingArrInput = createJsonInput({
    label: "Existing array",
    comments: "Collection of items to be compared.",
    required: true,
    defaultValue: [],
    mustBeArray: true
});

export const fieldsToCompare = createJsonInput({
    label: "Fields to compare",
    comments: "List of fields to compare for equality. The first field is always seen as the unique identifier",
    required: true,
    defaultValue: [],
    mustBeArray: true
});