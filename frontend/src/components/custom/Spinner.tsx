import React from "react";

interface Props {
  styles?: object;
}

function Spinner({ styles }: Props) {
  return (
    <div
      className="w-10 h-10 border border-b-0 border-purple-500 rounded-full animate-spin absolute z-50"
      style={{ top: "50%", left: "50%", ...styles }}
    />
  );
}

export default Spinner;
