import React from "react";

export default function MultiMessage(props) {

  //split the multimessage string into an array of strings
  const items = props.data.__html.split("|");
  let htmlArr = [];

  //Set the messages to correct format
  items.map(item => {
    htmlArr.push({"__html": item})
  })

  return (
    <div>
      {htmlArr.map((item, i) => (
        <div className="k-bubble" key={i}>
          <div dangerouslySetInnerHTML={item} />
        </div>
      ))}
    </div>

  )
}