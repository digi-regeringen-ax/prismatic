import {  component } from "@prismatic-io/spectral";
import actions from "./actions";

// Define and export the component
export default component({
  key: "digi-helpers",
  public: false,
  display: {
    label: "LR-helpers",
    description: "Helpers for handling common tasks",
    iconPath: "logo.png"
  },
  actions,
});
