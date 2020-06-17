import React, { useState } from "react";
import * as marked from "marked";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
//Import the message templates
import Reply from "./Reply";
import Timeline from "./Timeline";
import ImageLink from "./ImageLink";
import MultiMessage from "./MultiMessage";
import ClaimMessage from "./ClaimMessage";
import ImageLink from "./ImageLink";
import TextAndImage from "./TextAndImage";

// An override of the message renderer to allow markdown and other content styling
export default function MessageTemplate(props) {
  let message = props.item;

  //Changes data on date Author: Anish
  const handleDateChange = event => {
    message.dateresponse = message.dateFormatter(event.target.value);
    if (
      message.getMessageState()[message.getMessageState().length - 1] != message
    ) {
      for (let i = 0; i < message.getMessageState().length; i++) {
        if (message.getMessageState()[i] == message) {
          let messageArr = message.getMessageState();
          if (messageArr[i + 1].text.toLowerCase() == "not returning") {
            break;
          }
          messageArr[i + 1].text =
            message.dateFormatter(event.target.value);
          message.setMessageState(messageArr);
        }
      }
    }
  };

  //Author: Anish
  //activated when drop down changes
  const handleDropdownChange = event => {
    message.dropdownChoice = event.target.value;
    if (
      message.getMessageState()[message.getMessageState().length - 1] != message
    ) {
      for (let i = 0; i < message.getMessageState().length; i++) {
        if (message.getMessageState()[i] == message) {
          let messageArr = message.getMessageState();
          messageArr[i + 1].text = event.target.value;
          message.setMessageState(messageArr);
        }
      }
    }
  };

  // parse markdown language
  let parser = marked.setOptions({});
  let parsedMessage = parser.parse(message.text);
  let htmlToinsert = { __html: parsedMessage };

  const messageType = message.type + "";
  switch (messageType) {
    case "introduction":
      return (
        <div>
          <div className="introduction-to-chat">
            <img
              alt="unumlogo"
              src="https://logos-download.com/wp-content/uploads/2016/06/Unum_logo_blue.png"
              width="63"
              height="20"
            />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Welcome Back,
              <br />
              Alison
              <br />
            </span>
          </div>
          <div className="introduction-to-chat-date">
            {("" + new Date()).substring(0, 16)}
          </div>
        </div>
      );
      break;

    case "timeline":
      return <Timeline link={message.timeline_image_link} />;
      break;

    case "dropdown": //Author: Anish
      return (
        <div className="k-bubble">
          <div dangerouslySetInnerHTML={htmlToinsert} />
          <p hidden>
            {message.dropdownChoice
              ? (message.dropdownChoice = message.dropdownChoice)
              : (message.dropdownChoice = message.list_of_options.split(
                  ","
                )[0])}
          </p>
          <DropDownList
            onChange={handleDropdownChange}
            data={message.list_of_options.split(",")}
          />
        </div>
      );
      break;

    case "datepicker":
      return (
        <div className="k-bubble">
          <div dangerouslySetInnerHTML={htmlToinsert} />
          <p hidden>
            {message.dateresponse
              ? (message.dateresponse = message.dateresponse)
              : (message.dateresponse = message.dateFormatter(new Date()))}{" "}
            //Author: Anish
          </p>
          <DatePicker
            onChange={handleDateChange}
            defaultValue={new Date()}
            format="dd/MMM/yyyy"
            weekNumber={true}
          />
        </div>
      );
      break;

    case "textandimage":
      const imagehtml = { __html: message.rich_text };
      return (
        <TextAndImage data={{ html: htmlToinsert, imagehtml: imagehtml }} />
      );
      break;

    case "imagelink":
      const imagehtml = { __html: message.imagelink_image };
      return <ImageLink data={{ imagehtml: imagehtml, message: message }} />;
      break;

    case "multimessage":
      return <MultiMessage data={htmlToinsert} />;
      break;

    case "claimmessage":
      const imagehtml = { __html: message.statusimage };
      return <ClaimMessage data={{ message: message, imagehtml: imagehtml }} />;
      break;

    case "reply":
      return <Reply htmlToinsert={htmlToinsert} />;
      break;

    default:
      return <Reply htmlToinsert={htmlToinsert} />;
      break;
  }
}
