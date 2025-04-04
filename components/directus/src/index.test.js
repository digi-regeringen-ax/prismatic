import {createHarness} from "@prismatic-io/spectral/dist/testing";
import myComponent from "./index";
import connections from "./connections";
import uploadFileAction from "./actions/files/uploadFile";
import path from "path";
import fs from "fs";

const harness = createHarness(myComponent);
const myConnection = harness.connectionValue(connections);


//
// describe("Test getSingleton action", () => {
//     test("Ensure the getSingleton action returns an item", async () => {
//         const result = await harness.action("getSingletonAction", {
//             directusConnection: myConnection,
//             collection: "settings",
//             fields: ['*'],
//             filter: {},
//             alias: {},
//             deep: {}
//         });
//
//         expect(result?.data).toEqual({
//                 "headline": "My headline.",
//                 "id": 1
//             }
//         );
//     });
// });


describe("Test createItem action", () => {
    test("Ensure the createItem action works", async () => {

        const result = await harness.action("createItemAction", {
            directusConnection: myConnection,
            collection: "candidates",
            data: {

                "first_name": "Joni Kristian",
                "last_name": "Kivi",
                "address": "Sepänkatu 11 A 9",
                "zip_code": "70100",
                "city": "KUOPIO",
                "phone": "018 13909",
                "email": "j@paf.com",
                "ssn": "010469-999W",
                "profession": "Tullare",
                "source": {
                    "_id": 1979,
                    "_confirmationNumber": "7a879e78da",
                    "_timestamp": "2025-04-01 15:14:04",
                    "_formId": 3274,
                    "_formName": "Anmälningsformulär för kandidater i valet 2027",
                    "_language": "sv",
                    "_suomifiIdentification": {
                        "AuthenticatingAuthority": [
                            "https://testi.apro.tunnistus.fi/idp1"
                        ],
                        "AuthnInstant": 1743494158,
                        "SessionIndex": "_55852d0218c9f446a20a9ce9bcc1a237",
                        "AuthnContext": "urn:oid:1.2.246.517.3002.110.999"
                    },
                    "first_name": "Joni Kristian",
                    "last_name": "Kivi",
                    "ssn": "010469-999W",
                    "address": "Sepänkatu 11 A 9",
                    "zip_code": "70100",
                    "city": "KUOPIO",
                    "municipality": "Kuopio",
                    "profession": "Tullare",
                    "phone": "018 13909",
                    "email": "j@paf.com",
                    "municipality_list": "438",
                    "KomunalvalPartier": "Åländsk Center",
                    "_attachments": []
                },
                "type": "municipality",
                "used_form": true,
                "municipality": "478",
                "party": "L"
            }

        });

        expect(result.data.status).toBeGreaterThanOrEqual(200)
        expect(result.data.status).toBeLessThanOrEqual(299)
        //           .toHaveProperty('id');
    });
})
;

//
// describe("Test uploadFileAction action", () => {
//     test("Ensure the uploadFileAction action really uploads a file", async () => {
//
//
//         const fs = require('fs');
//         const path = require('path');
//         const filePath = path.resolve(__dirname, './test.pdf');
//         const fileBuffer = fs.readFileSync(filePath);
//
//         const result = await harness.action("uploadFileAction", {
//             directusConnection: myConnection,
//             title: "My title",
//             description: "My description",
//             data: fileBuffer,
//             folder: null,
//             tags: "123;456;789"
//         });
//
//         expect(result?.data).toHaveProperty('id');
//     });
// });
//
// describe("Test createFolder", () => {
//     test("Ensure the createFolder action really creates a folder", async () => {
//         const result = await harness.action("createFolderAction", {
//             directusConnection: myConnection,
//             name: "My Test Folder",
//             parent: ''
//         });
//
//         expect(result?.data).toHaveProperty('id');
//     });
// });
//
//
// describe("Test listFoldersAction", () => {
//     test("Ensure the listFoldersAction action really creates a folder", async () => {
//         const result = await harness.action("listFoldersAction", {
//             directusConnection: myConnection,
//             limit: -1,
//             filter:{
//                 "name": {
//                     "_eq": "response_1939"
//                 },
//                 "parent": {
//                     "_eq": "a507e345-6c28-41fa-8719-62fb5d54148c"
//                 }
//             }
//         });
//         console.log(result);
//         expect(result?.data[0]).toHaveProperty('id');
//     });
// });