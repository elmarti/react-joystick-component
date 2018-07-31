import { withInfo } from "@storybook/addon-info";
import * as wInfoStyle from "./styles.json";
export function wInfo (text: string) : any {
  return withInfo({ inline: true, source: false, styles: wInfoStyle, text: text });
}
