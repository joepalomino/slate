/** @jsx jsx */
import { jsx } from "@emotion/core";

export const Wrapper = props => (
  <div
    css={{
      padding: "1.5625rem",
      maxWidth: "76.875rem",
      margin: "0 auto"
    }}
  >
    {props.children}
  </div>
);
