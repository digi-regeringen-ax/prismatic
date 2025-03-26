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
    test("Ensure the get_response action returns a file", async () => {

        const RESPONSE_ID = 1944;
        const {result} = await invoke(get_response, {
            eFormConnection: createConnection(eFormConnection, credentials.fields),
            response_id: 1944,
            type: "pdf",
            include_attachments: false
        });


        console.log('My data', result.data.substring(0, 100));

        expect(result.data[0]).toHaveProperty("_id");
        expect(result.data[0]).toHaveProperty("_id", RESPONSE_ID);

    });
});

