import {action} from "@prismatic-io/spectral";
import {createJsonInput, createStringInput} from "../utilities/inputs";
import {v4 as uuidv4} from 'uuid';
//import deepmerge from "deepmerge";
import {merge, cloneDeep} from 'lodash';
import {clearSecretFields} from "../utilities/secret-identity";

export const merge_with_subscriptions = action({
    display: {
        label: "Merge old subscriptions and new DVV-data",
        description: "Creates an object with changes and newly incoming persons"
    },
    inputs: {
        oldValuesFromSubscriptions: createJsonInput({
            label: "Array of values from subscription for given project",
            type: "data",
            required: true,
            mustBeArray: true,
            comments: "Fetched items from subscriptions"
        }),
        newValuesFromDvv: createJsonInput({
            label: "Data input from DVV",
            type: "data",
            required: true,
            mustBeArray: true,
            comments: "New values from DVV (must be parsed)"
        }),
        projectCode: createStringInput({
            label: "Project code",
            required: true,
            comments: "The project code to save the subscriptions under"
        })
    },
    perform: async (context, {oldValuesFromSubscriptions, newValuesFromDvv, projectCode}) => {
        // Create a map for newValues for quick lookup by SSN
        const newValuesMap = new Map(newValuesFromDvv.map(entry => [entry.key, entry.value]));

        // Create separate arrays for updated and new entries
        const updatedResults = [];
        const newResults = [];

        // Iterate through oldValues
        oldValuesFromSubscriptions.forEach(oldEntry => {
            const ssn = oldEntry.ssn;

            if (newValuesMap.has(ssn)) {
                // If the SSN exists in both old and new, merge the data and value branches
                // const newValue = JSON.parse(JSON.stringify(newValuesMap.get(ssn)));
                // const oldValue = JSON.parse(JSON.stringify(oldEntry.data));
                // const mergedResult = deepMerge({...oldValue}, newValue);

                const mergedResult = merge(cloneDeep(oldEntry.data), newValuesMap.get(ssn))
                updatedResults.push({
                    ...oldEntry,  // Include all properties from the old entry
                    data: clearSecretFields(mergedResult),
                    state: 'UPDATED'
                });
                // Remove the matched newValue from the map, so we can later add only unmatched newValues
                newValuesMap.delete(ssn);
            }
        });

        // Add the remaining unmatched entries from newValues as new items
        newValuesMap.forEach((newValue, ssn) => {
            newResults.push({
                id: uuidv4(),                // New id because it's new
                project: projectCode,    // Set project property as passed into the function
                ssn: ssn,
                data: clearSecretFields(newValue),          // Set the data to new value's value branch
                previous_ssns: null,     // No previous SSNs
                state: 'NEW'             // Mark the state as 'NEW'
            });
        });

        // Return the separated results
        return {
            data: {
                updated: updatedResults,   // Items that were updated
                new: newResults            // Items that were newly added
            }
        };
    }
});