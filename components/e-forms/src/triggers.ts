import { trigger } from "@prismatic-io/spectral";

export const myTrigger = trigger({
  display: {
    label: "My Trigger",
    description: "This is my trigger",
  },
  perform: async (context, payload, params) => {
    console.log("My Trigger params", params);
    return Promise.resolve({
      payload,
    });
  },
  inputs: {},
  synchronousResponseSupport: "valid",
  scheduleSupport: "valid",
});

export default { myTrigger };
