import { Theme as MTheme } from "@material-ui/core/styles";

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends MTheme {}
}
