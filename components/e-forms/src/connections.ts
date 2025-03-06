import { connection } from "@prismatic-io/spectral";

export const eFormConnection = connection({
  key: "eForms",
  display: {
    label: "Connection to e-forms-service",
    description: "Connection to e-forms-service",
  },
  inputs: {
    endpoint: {
      label: "Base URL",
      placeholder: "Base URL",
      type: "string",
      required: true,
      comments: "URL for connection",
    },
    username: {
      label: "Username",
      placeholder: "Username",
      type: "string",
      required: true,
      comments: "Username for connection",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      comments: "Password for connection",
    },
  },
});

export default [eFormConnection];
