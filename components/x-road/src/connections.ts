import { connection } from "@prismatic-io/spectral";

export const xRoadConnection = connection({
  key: "xRoadConnection",
  display: {
    label: "X-Road Connection to Security Server",
    description: "X-Road Connection to Security Server",
  },
  inputs: {
    xRoadSecurityServerUrl: {
      label: "X-Road Security Server URL",
      placeholder: "X-Road Security Server URL",
      type: "string",
      required: true,
      comments: "X-Road Security Server URL",
    },
    xRoadProviderMemberClass: {
      label: "X-Road Provider Member Class",
      placeholder: "X-Road Provider Member Class",
      type: "string",
      required: true,
      comments: "X-Road Provider Member Class",
    },
    xRoadProviderMemberCode: {
      label: "X-Road Provider Member Code",
      placeholder: "X-Road Provider Member Code",
      type: "string",
      required: true,
      comments: "X-Road Provider Member Code",
    },
    xRoadProviderSubsystemCode: {
      label: "X-Road Provider Subsystem Code",
      placeholder: "X-Road Provider Subsystem Code",
      type: "string",
      required: true,
      comments: "X-Road Provider Subsystem Code",
    },
    xRoadProviderServiceCode: {
      label: "X-Road Provider Service Code",
      placeholder: "X-Road Provider Service Code",
      type: "string",
      required: true,
      comments: "X-Road Provider Service Code",
    },
    xRoadClientPhrase: {
      label: "X-Road Client",
      placeholder: "X-Road Client",
      type: "string",
      required: true,
      comments: "X-Road Client",
    }
  },
});

export default [xRoadConnection];