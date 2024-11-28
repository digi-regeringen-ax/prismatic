import {action} from "@prismatic-io/spectral";
import {FinnishSSN} from "finnish-ssn";
import {createStringInput} from "../utilities/inputs";

// Action: Validate
export const validateFinnishSSNaction = action({
    display: {
        label: "Validate Finnish SSN",
        description: "Returns true or false"
    },
    inputs: {
        incomingSSN: createStringInput({
            label: "SSN",
            comments: "Provide SSN to check",
            required: true
        })
    },
    perform: async (context, {incomingSSN}) => FinnishSSN.validate(incomingSSN)
});

// Action: Parse
export const parseFinnishSSNaction = action({
    display: {
        label: "Parse Finnish SSN",
        description: "Returns object with parsed details"
    },
    inputs: {
        incomingSSN: createStringInput({
            label: "SSN",
            comments: "Provide SSN to parse",
            required: true
        })
    },
    perform: async (context, {incomingSSN}) =>
        FinnishSSN.validate(incomingSSN) ? FinnishSSN.parse(incomingSSN) : null
});
