import {createJsonInput} from "../utilities/inputs";

export const merge_with_subscriptions = createJsonInput({
    label: "Data input from DVV",
    type: "data",
    required: true,
    comments: "Needs 'henkilotunnus' (string) and 'tietoryhmat' (array)"
});
