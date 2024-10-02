import createItemAction from "./items/createItem";
import createItemsAction  from "./items/createItems";
import deleteItemAction from "./items/deleteItem";
import deleteItemsAction from "./items/deleteItems";
import getItemAction from "./items/getItem";
import getItemsAction from "./items/getItems";
import getSingletonAction from "./items/getSingleton";
import updateItemsAction from "./items/updateItems";
import updateItemAction from "./items/updateItem";
import updateSingletonAction from "./items/updateSingleton";

import deleteFileAction from "./files/deleteFile"
import deleteFileByFilterAction from "./files/deleteFileByFilter"
import importFileAction from "./files/importFile"
import listFilesAction from "./files/listFiles"
import readFileAction from "./files/readFile"
import updateFileAction from "./files/updateFile"
import updateFileMetaDataAction from "./files/updateFileMetaData"
import uploadFileAction from "./files/uploadFile"
import genericCallToSDKAction from "./genericCallToSDK"

export default {
  createItemAction,
  createItemsAction,
  deleteItemAction,
  deleteItemsAction,
  getItemAction,
  getItemsAction,
  getSingletonAction,
  updateItemsAction,
  updateItemAction,
  updateSingletonAction,

  deleteFileAction,
  deleteFileByFilterAction,
  importFileAction,
  listFilesAction,
  readFileAction,
  updateFileAction,
  updateFileMetaDataAction,
  uploadFileAction,

  genericCallToSDKAction

};