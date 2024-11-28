import {action} from "@prismatic-io/spectral";
import {createJsonInput} from "../utilities/inputs";

const convert_to_hbrAction = action({
    display: {
        label: "Merge set of data from datalagret with HBR",
        description: "Returns which items are new, which are old, and which change, given two arrays."
    },
    inputs: {
        newObj: createJsonInput({
            label: "Object from datalagret",
            comments: "Object according to spec from Consilia",
            required: true,
            defaultValue: {},
            mustBeArray: false
        }),
        directusObj: createJsonInput({
            label: "Previous object",
            comments: "Previous object from HBR",
            required: true,
            defaultValue: {},
            mustBeArray: false
        })
    },
    perform: async (context, {newObj, directusObj}) => {
        const result = {data: {}, operation: "update"};
        const on_aland = ["035", "043", "060", "062", "065", "076", "170", "295", "318", "417", "438", "478", "736", "766", "771", "941"];

        if (!directusObj.ssn) {
            result.operation = "insert";
            result.data.state = "new";
        }

        Object.assign(result.data, {
            ssn: newObj.ssn,
            first_name: newObj.firstNames,
            last_name: newObj.lastName,
            birth_date: newObj.birthDate,
            street_address: newObj.streetAddress,
            city: newObj.city,
            zip: newObj.postalCode,
            municipality: {key: newObj.municipalityCode, collection: "municipalities"},
            death_date: newObj.deceasedDate
        });

        if (newObj.deceasedDate) {
            result.data.state = 'dead';
        }

        if (!on_aland.includes(newObj.municipalityCode) && on_aland.includes(directusObj.municipality?.key)) {
            result.data.departure_date = newObj.municipalityDate;
            const futureDate = new Date(newObj.municipalityDate);
            futureDate.setFullYear(futureDate.getFullYear() + 5);
            result.data.right_expiration_date = futureDate.toISOString().split('T')[0];
        }

        if (on_aland.includes(newObj.municipalityCode) && !on_aland.includes(directusObj.municipality?.key)) {
            result.data[directusObj.entry_date ? 'return_date' : 'entry_date'] = newObj.municipalityDate;
        }

        return {data: result};
    }
});

export default convert_to_hbrAction;