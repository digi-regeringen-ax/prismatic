import {createConnection, createHarness, invoke} from "@prismatic-io/spectral/dist/testing";
import myComponent from "./index";
import {
    response_export,
    list_new,
    list,
    get_response_attachment,
    get_response
} from "./actions";
import {eFormConnection} from "./connections";

const credentials = JSON.parse(process.env.PRISMATIC_CONNECTION_VALUE || "{}")
import {ConnectionValue} from "@prismatic-io/spectral/dist/serverTypes";

describe("Test response_export action", () => {
    test("Ensure the response_export action returns an item", async () => {

        const CHECK_FORM_ID = 3268;
        const {result} = await invoke(response_export, {
            eFormConnection: createConnection(eFormConnection, credentials.fields),
            form_id: CHECK_FORM_ID,
            type: "json",
            selection: "all",
            include_attachments: false
        });

        expect(result.data[0]).toHaveProperty("_id");
        expect(result.data[0]).toHaveProperty("_formId", CHECK_FORM_ID);

    });
});