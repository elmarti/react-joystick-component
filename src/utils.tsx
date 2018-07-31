import { withInfo } from "@storybook/addon-info";

export function wInfo (text: string) : any {
  return withInfo({ inline: true, source: false, text: text });
}
