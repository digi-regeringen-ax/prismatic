import {input} from "@prismatic-io/spectral";
import {isArray, isJsonString} from "../utilities/types";

export const dataInput = input({
    label: "Data input from DVV",
    type: "data",
    required: true,
    comments: "Needs 'henkilotunnus' (string) and 'tietoryhmat' (array)",
    clean: (value) => {
        const parsedValue = isJsonString(value) ? JSON.parse(value) : value;

        // Check if parsedValue is an array
        if (!isArray(parsedValue)) {
            throw new Error("Expected parsedValue to be an array of objects");
        }

        parsedValue.forEach((item, index) => {
            if (!item.hasOwnProperty('henkilotunnus') || typeof item.henkilotunnus !== 'string') {
                throw new Error(`Item at index ${index} is missing 'henkilotunnus' or it is not a string.`);
            }
            if (!item.hasOwnProperty('tietoryhmat') || !Array.isArray(item.tietoryhmat)) {
                throw new Error(`Item at index ${index} is missing 'tietoryhmat' or it is not an array.`);
            }
        });

        return parsedValue;
    }
});
