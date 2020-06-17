import React, { useState } from "react";
import ReactDOM from "react-dom";
import * as marked from "marked";


//Author: Anish
export default function AttachmentTemplate(props) {
  let attachment = props.item;

   // parse markdown language
  let parser = marked.setOptions({});
  let parsedAttachmentImageHTML = parser.parse(attachment.imageHTML);
  let imageHTML = { __html: parsedAttachmentImageHTML };

  console.log(attachment.imageHTML);
    if (attachment.contentType === 'linkAttachment') {
        return(
        <div>
        <a href={attachment.websiteURL} target="_blank" draggable={false} tabIndex={-1}>
            <div dangerouslySetInnerHTML={imageHTML} style={{height: "70%", overflow: 'hidden', marginBottom: 10, borderRadius: '30px 30px 0px 0px'}}/>
        </a>
        </div>);
    } else {
      return null
    }
}