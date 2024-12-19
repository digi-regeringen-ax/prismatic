# Deploy Prismatic Custom Components

Requires Prismatic's CLI to be installed. You can install it by running `npm install -g @prismatic-io/prism`.

Set the environment variable PRISMATIC_URL to https://integrations.gov.ax before logging in with 

`prism login`

to authenticate with your Prismatic account. Check with `prism me` if you're logged in.

To deploy the integration, run `npm run publish` in each directory (do not forget to `npm install` the dependencies) in order to publish the component. In the flows, update the versioning number.

More information is found here: https://prismatic.io/docs/cli regarding the CLI.