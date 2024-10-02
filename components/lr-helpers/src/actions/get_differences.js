import {action} from "@prismatic-io/spectral";

import {
    incomingArrInput,
    existingArrInput,
    fieldsToCompare
} from "../inputs";

// Action: Create Item
const get_differencesAction = action({
    display: {
        label: "Get differences between two arrays",
        description: "Returns which items are new, which are old, and which change, given two arrays."
    },
    inputs: {
        incomingArr: incomingArrInput,
        existingArr: existingArrInput,
        fieldsToCompare: fieldsToCompare
    },
    perform: async (context, { incomingArr, existingArr, fieldsToCompare }) => {

        const idProp = fieldsToCompare[0]; // Expect idProp to be the first field in fieldsToCompare
        const existingMap = new Map(existingArr.map(item => [item[idProp], item]));

        const result = { insert: [], update: [], delete: [] };

        // Helper function to pick only specified fields
        const pickFields = (item, fields) => {
            const picked = {};
            fields.forEach(field => {
                if (item.hasOwnProperty(field)) {
                    picked[field] = item[field];
                }
            });
            return picked;
        };

        // Loop through incomingArr
        for (const incomingItem of incomingArr) {
            const id = incomingItem[idProp];
            const existingItem = existingMap.get(id);

            if (!existingItem) {
                // Item is not found in existingArr, so add to insert
                result.insert.push(pickFields(incomingItem, fieldsToCompare));
            } else {
                // Item exists, compare fieldsToCompare for differences
                const hasDifferences = fieldsToCompare.some(field => incomingItem[field] !== existingItem[field]);

                if (hasDifferences) {
                    result.update.push(pickFields(incomingItem, fieldsToCompare));
                }

                // Remove the processed item from the map
                existingMap.delete(id);
            }
        }

        // Remaining items in existingMap are to be deleted
        for (const [id] of existingMap) {
            result.delete.push(id);
        }

        return { data: result };
    }
});

export default get_differencesAction;