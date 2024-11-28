import {createHarness} from "@prismatic-io/spectral/dist/testing";
import myComponent from "./index";
import connections from "./connections";

const harness = createHarness(myComponent);
const myConnection = harness.connectionValue(connections);

describe("Test getSingleton action", () => {
    test("Ensure the getSingleton action returns an item", async () => {
        const result = await harness.action("getSingletonAction", {
            directusConnection: myConnection,
            collection: "admin_settings",
            fields: ['*'],
            filter: {},
            alias: {},
            deep: {}
        });

        expect(result?.data).toEqual({
                "id": 1,
                "last_update":
                    "2022-01-01"
            }
        );
    });
});