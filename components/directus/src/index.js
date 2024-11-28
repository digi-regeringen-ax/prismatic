import {component} from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

// Define and export the component
export default component({
    key: "directus",
    public: false,
    display: {
        label: "Directus SDK",
        description: "A connection to a Directus instance",
        iconPath: "icon.png"
    },
    actions,
    connections,
});
