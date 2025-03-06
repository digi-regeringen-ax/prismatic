import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

export default component({
  key: "eForms",
  public: false,
  display: {
    label: "E-tjänster-API",
    description: "E-tjänster-API från Consilia",
    iconPath: "icon.png",
  },
  actions,
  //triggers,
  //dataSources,
  connections,
});
