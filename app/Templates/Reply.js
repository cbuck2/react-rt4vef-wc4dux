import React from "react";

export default function ReplyTemplate(props) {
  return (
    <div className="k-bubble">
      <div dangerouslySetInnerHTML={props.htmlToinsert} />
    </div>
  )
}