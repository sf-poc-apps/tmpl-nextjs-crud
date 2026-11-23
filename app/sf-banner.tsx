/* SF-POC-BANNER. Required on every page. Do not remove, restyle or edit. Protected: changes are reverted. */
import type { CSSProperties } from "react";

const style: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 2147483647,
  background: "#4b1f7a",
  color: "#fff",
  font: "600 13px/1.4 system-ui,sans-serif",
  padding: "6px 12px",
  textAlign: "center",
};

/* Rendered on the server so it is part of the page React hydrates. A banner added to the DOM by a
   script is removed again when React takes over the document. */
export default function SfBanner() {
  const expires = (process.env.SF_EXPIRES ?? "").slice(0, 10) || "soon";
  const staging = process.env.SF_ENV === "staging" ? " (staging)" : "";
  return (
    <div id="sf-banner" role="note" style={style}>
      {`POC built by an AI software factory${staging} - expires on ${expires}. Do not enter personal or confidential data.`}
    </div>
  );
}
