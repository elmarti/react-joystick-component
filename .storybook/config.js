import { configure } from "@storybook/react";
import { setAddon, addDecorator } from "@storybook/react";
import JSXAddon from "storybook-addon-jsx";


setAddon(JSXAddon);

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
