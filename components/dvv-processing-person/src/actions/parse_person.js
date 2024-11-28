import {action} from "@prismatic-io/spectral";
import {DVV_person} from "../dvv-person";
import {dataInput} from "../inputs/Incoming_dvv_person";

export const convertPersonData = action({
    display: {
        label: "Parse DVV-person data",
        description: "Convert DVV's data structure into a more readable one."
    },
    inputs: { dvv_persons: dataInput },
    perform: async (context, {dvv_persons}) => {
        // Use a Map for more efficient lookup and insertion
        const processedValue = dvv_persons.reduce((acc, item) => {
            if (typeof item.henkilotunnus !== "string" || !Array.isArray(item.tietoryhmat)) {
                throw new Error("Each item must have a 'henkilotunnus' (string) and 'tietoryhmat' (array)");
            }

            // Use the Map to store attributes based on 'henkilotunnus'
            if (!acc.has(item.henkilotunnus)) {
                acc.set(item.henkilotunnus, []);
            }
            acc.get(item.henkilotunnus).push(...item.tietoryhmat);
            return acc;
        }, new Map());

        const target = {};

        // Use for-of loop for better readability and performance over Object.keys
        for (const [ssn, attributes] of processedValue.entries()) {
            const thisPerson = new DVV_person(ssn);

            // Simplify attribute handling using a forEach loop
            attributes.forEach((personsAttribute) => {
                if (personsAttribute.tietoryhma in thisPerson) {
                    thisPerson[personsAttribute.tietoryhma](personsAttribute);
                } else {
                    console.warn("Unhandled property", personsAttribute);
                }
            });

            // Store result directly in the target object
            thisPerson.data.ssn = ssn;
            target[ssn] = thisPerson.data;
        }

        return {
            data: target
        };
    }
});
