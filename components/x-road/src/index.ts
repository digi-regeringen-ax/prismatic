import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import triggers from "./triggers";
import connections from "./connections";

export default component({
  key: "xRoad",
  public: false,
  display: {
    label: "X-Road",
    description: "X-Road component",
    iconPath: "icon.png",
  },
  actions,
  triggers,
  connections,
});
