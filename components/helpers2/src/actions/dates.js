import {action} from "@prismatic-io/spectral";
import moment from "moment";
import {createStringInput} from "../utilities/inputs";

// Action: Validate
export const GetDateAction = action({
    display: {
        label: "Get date",
        description: "Returns true or false"
    },
    inputs: {
        startingDay: createStringInput({
            label: "Starting day (optionali)",
            comments: "Date to parse. Empty for today",
            required: false
        }),
        format: createStringInput({
            label: "Date format",
            comments: "Format of the date",
            required: false
        }),
        offsetInDays: createStringInput({
            label: "offsetInDays",
            comments: "Number of days to offset. Positive for future, negative for past",
            required: false
        })
    },
    perform: async (context, {startingDay, offsetInDays, format}) => {
        const momentObj = startingDay ? moment(startingDay) : moment();
        if (offsetInDays) {
            momentObj.add(offsetInDays, "days");
        }
        format = format || "YYYY-MM-DD";
        return momentObj.format(format);
    }
});
