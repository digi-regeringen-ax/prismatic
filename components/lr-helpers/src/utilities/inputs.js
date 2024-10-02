// Generalized input creation utility with custom cleaning logic
import {input} from "@prismatic-io/spectral";

const createInput = ({
                         label,
                         required = false,
                         defaultValue = "",
                         comments = "",
                         type = "string",
                         clean = (value) => value
                     }) => input({
    label,
    required,
    type,
    default: defaultValue,
    comments,
    clean
});

// Specialized JSON input creation with built-in JSON validation
export const createJsonInput = ({
                             label,
                             required = false,
                             defaultValue = {},
                             comments = "",
                             mustBeArray = false,
                             clean = null
                         }) => {
    const cleanFn = clean || ((value) => {
        if (Array.isArray(value) || isObject(value)) {
            return value;
        }
        if (!value) return mustBeArray ? [] : {};
        if (!isJsonString(value)) {
            throw new Error(`Invalid JSON for ${label}: ${value}`);
        }

        const result = JSON.parse(value);
        if (mustBeArray && !Array.isArray(result)) {
            throw new Error(`Expected an array for ${label}, but got ${typeof result}`);
        }
        return result;
    });

    return createInput({
        label,
        required,
        defaultValue,
        comments,
        type: "code",
        clean: cleanFn
    });
};

// Reusable String Input utility
export const createStringInput = (options) => createInput({...options, type: "string"});
