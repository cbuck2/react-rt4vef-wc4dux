
import React from "react";

export default function Timeline(props) {
  return (
    <div id="timeline" className="k-bubble timeline">
      <img
        alt="timeline view"
        src= {props.link}
      />
    </div>
  )
}