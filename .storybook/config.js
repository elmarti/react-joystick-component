import { configure } from "@storybook/react";
import {configureActions} from "@storybook/addon-actions";

configureActions({
    limit:10
});



// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /.stories.tsx$/);
function loadStories() {

    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
console.log("configuring actions")

