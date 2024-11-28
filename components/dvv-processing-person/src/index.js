import {component} from "@prismatic-io/spectral";

import {convertPersonData} from "./actions/parse_person";

// Define and export the component
export default component({
    key: "parse-dvv-person-data",
    public: false,
    display: {
        label: "DVV-components",
        description: "Toolbox for processing data received from DVV",
        iconPath: "dvv2.png"
    },
    actions: {
        convertPersonData
    }
});
