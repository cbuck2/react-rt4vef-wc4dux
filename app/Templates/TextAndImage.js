import React from "react";

export default function TextAndImage(props) {
  return (
    <div id="textandimage" style={{paddingBottom: 0}} className="k-bubble">
      <div dangerouslySetInnerHTML={props.data.html} />
      <br/>
      <div style={{textAlign: 'center'}} dangerouslySetInnerHTML={props.data.imagehtml} />
      
    </div>

  )
}