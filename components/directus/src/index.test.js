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


describe("Test uploadFileAction action", () => {
    test("Ensure the uploadFileAction action really uploads a file", async () => {


        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(__dirname, './test.pdf');
        const fileBuffer = fs.readFileSync(filePath);

        const result = await harness.action("uploadFileAction", {
            directusConnection: myConnection,
            title: "My title",
            description: "My description",
            data: fileBuffer,
            folder: null,
            tags: "123;456;789"
        });

        expect(result?.data).toHaveProperty('id');
    });
});
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