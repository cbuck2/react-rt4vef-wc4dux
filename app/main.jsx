/**
 * Anish's Version
 * 6/16/2020
 */

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Chat, ChatMessage } from "@progress/kendo-react-conversational-ui";
import {
  Dialog,
  DialogActionsBar,
  Window
} from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import MessageTemplate from "./Templates/MessageTemplate"; //Author: Anish
import AttachmentTemplate from "./Templates/AttachmentTemplate"; //Author: Anish

class App extends React.Component {
  constructor(props) {
    super(props);
    this.user = {
      id: 1
    };
    this.bot = {
      id: 0,
      avatarUrl:
        "https://hosted-machinelogic-io.s3.amazonaws.com/phoenix-poc/chat-unum-logo%402x.png"
    };
    //Author: Anish
    this.noUser = {
      id: 2
    };
    this.kentoAPILink =
      "https://deliver.kontent.ai/1200a86a-166d-00c6-def3-61d702060979/items";
    this.state = {
      messages: [],
      data: [],
      conversations: { instructions: "", choices: [] },
      displayConversations: false,
      selectedConversation: ""
    };
  }

  //Author: Anish - got rid of handler() function for date

  componentDidMount() {
    this.loadData().then(res => {
      this.populateConversations().then(res => {
        this.setState({ displayConversations: true });

        //Author: Anish - removed this because welcomeText isn't being used here
        //I will use this.extractWelcomeText() in selectConversation() instead
        //const welcomeText = this.extractWelcomeText();
      });
    });
  }

  /*
   * An override of message to control things as date formatting
   * Author: Anish
   */
  CustomChatMessage(props) {
    //date only shows time
    return props.item.type == "introduction" ? (
      <ChatMessage {...props} dateFormat={" "} />
    ) : (
      <ChatMessage {...props} dateFormat={"t"} />
    );
  }

  /*
   * Load the data from Kentico
   */
  loadData = () => {
    return new Promise((resolve, reject) => {
      fetch(this.kentoAPILink)
        .then(resp => resp.json())
        .then(data => {
          this.setState({ data: data.items });
          resolve({ status: 200 });
        })
        .catch(e => {
          console.log(e);
          reject({ status: 500 });
        });
    });
  };

  /*
   * Get values for the welcome text
   */
  extractWelcomeText = () => {
    let messages = this.state.messages;
    const welcomeMessage = this.getMessageData("welcome_message", this.noUser);
    messages.push(welcomeMessage);
  };

  /*
   * Popluate the conversation flow options
   */
  populateConversations = () => {
    return new Promise((resolve, reject) => {
      try {
        this.state.data.map(item => {
          if (item.system.type == "conversationoptions") {
            this.setState({
              conversations: {
                instructions: item.elements.instructions_text.value,
                choices: item.elements.conversation_flows_options.value
              }
            });
          }
        });
        resolve({ status: 200 });
      } catch (e) {
        reject({ status: 500 });
      }
    });
  };

  /*
   * Return the message data from a Kentico object based on name
   */
  getMessageData = (name, author) => {
    let message = {};
    this.state.data.map(item => {
      if (item.system.codename == name) {
        //Get all the elements
        let keys = Object.keys(item.elements);
        message = Object.assign(
          {},
          ...keys.map(key => ({ [key]: item.elements[key].value }))
        );
      }
    });
    message.codename = name; //Author: Anish
    if (author) {
      message.author = author;
      message.timestamp = new Date();
    }
    return message;
  };

  /*
   * Get Messages for a selected conversation
   */
  selectConversation = choice => {
    //Loop through Kentico data to find conversation
    let messageNames = [];
    let messageArr = [];
    let messages = this.state.messages;

    //Get initial messages in conversation
    this.state.data.map(item => {
      if (item.system.codename == choice) {
        messageNames = item.elements.messages.value;
      }
    });

    //Loop through initial messages and get message data for each
    messageNames.map(name => {
      let messageData = this.getMessageData(name, this.bot);
      messageArr.push(messageData);
    });

    //Get suggested actions of final message
    let lastMessage = messageArr.length > 0 ? messageArr.length - 1 : 0;
    messageArr[lastMessage].suggestedActions = [];
    messageArr[lastMessage].suggested_actions.map(action => {
      let suggestedAction = {};
      let suggestedAction = this.getMessageData(action, this.user);

      messageArr[lastMessage].suggestedActions.push({
        type: suggestedAction.type,
        value: suggestedAction.text,
        link: suggestedAction.link,
        codename: suggestedAction.codename //Author: Anish
      });
    });

    //Author: Anish
    //adds welcome text at the top of every flow
    this.extractWelcomeText();

    messages.push(...messageArr);

    //set the state with the updated message array. This will populate messages in chat.
    this.setState({
      messages: messages,
      displayConversations: false
    });
  };

  setMessageState = messagesArr => {
    this.setState({
      messages: messagesArr
    });
  };

  getMessageState = () => {
    return this.state.messages;
  };

  getDayEnding = day => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  formatDate = date => {
    console.log(date);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const month = date.getUTCMonth();
    const day = ("" + date).substring(8, 10); //Author: Anish - (had to change, it was one day off for some reason)
    const year = date.getUTCFullYear();

    return (
      monthNames[month] + " " + +day + this.getDayEnding(day) + ", " + year
    );
  };

  /*
   * Get response's code name for duplicate responses with different next messages
   * Author: Anish
   */
  getResponseCodeName = response => {
    return new Promise((resolve, reject) => {
      try {
        //If user enters a custom response, the input to this function will be an obj with a codename parameter. If this is the case, return the codename supplied
        if (response.codename) {
          resolve(response.codename);
        } else {
          let lastMessageIndex =
            this.state.messages.length > 0 ? this.state.messages.length - 1 : 0;
          let lastMessageIndex = this.state.messages.length - 1;
          let lastMessage = this.state.messages[lastMessageIndex];
          let codename;

          //returns the codename of the suggestedAction corresponding with the response
          lastMessage.suggestedActions.map(suggestedAction => {
            if (response == suggestedAction.value.toLowerCase()) {
              codename = suggestedAction.codename;
            }
          });
          resolve(codename);
        }
      } catch (e) {
        reject({ status: 500 });
      }
    });
  };

  /*
   * Add a new response to the message stack
   */
  addNewResponse = resp => {
    // If user asks to restart, refresh the page.
    if (resp == "restart") {
      location.href = location.href;
    } else {
      let response = resp;

      const restart = [{ type: "reply", value: "Restart" }];
      let messages = this.state.messages;
      let botResponse = {};
      let newMessages = [];

      if (this.state.messages[this.state.messages.length - 1].waitForReply) {
        response = this.state.messages[this.state.messages.length - 1]
          .heldAction;
      }

      this.getResponseCodeName(response).then(responseCodeName => {
        // Record the message selected by the user
        this.state.data.map(item => {
          if (item.system.codename == responseCodeName) {
            let keys = Object.keys(item.elements);
            botResponse = Object.assign(
              {},
              ...keys.map(key => ({ [key]: item.elements[key].value }))
            );
          }
        });

        //Add response to messages
        if (response == "submit date") {
          //Author: Anish
          botResponse.text = this.state.messages[
            this.state.messages.length - 1
          ].dateresponse;
        }

        //Author: Anish - adds drop down choice as reply from user
        if (response == "submit choice") {
          botResponse.text = this.state.messages[
            this.state.messages.length - 1
          ].dropdownChoice;
        }

        if (botResponse.type == "answer") {
          botResponse.text = resp;
        }
        botResponse.author = this.user;
        botResponse.timestamp = new Date();
        messages.push(botResponse);

        //Loop through and get data for each message the response points to.
        botResponse.link.map(name => {
          let messageData = this.getMessageData(name, this.bot);

          //Author: Anish
          //If message is type datepicker, pass the parent date handler so the date will be updated.
          if (messageData.type == "datepicker") {
            messageData.getMessageState = this.getMessageState; //Author: Anish - pass down ability to retrieve state
            messageData.setMessageState = this.setMessageState; //Author: Anish - pass down ability to set state
            messageData.dateFormatter = this.formatDate; //Author: Anish - refurbished
          }

          //Author: Anish - will pass ability to change/retrieve state to dropdown message types
          if (messageData.type == "dropdown") {
            messageData.getMessageState = this.getMessageState; //Author: Anish - pass down ability to retrieve state
            messageData.setMessageState = this.setMessageState; //Author: Anish - pass down ability to set state
          }

          // //Author: Anish
          //IN PROGRESS
          if (messageData.type == "messageattachment") {
            let attachmentsArr = [];
            //the attachment will be a link to a website
            if (
              messageData.attachment_content_type_choices[0].name ==
              "linkAttachment"
            ) {
              let titleList = messageData.link_attachment_title_list.split(",");
              let urlList = messageData.link_attachment_link_list.split(",");
              let images = messageData.attachment_items_list.split("<p>,</p>");

              //used a for-loop because it takes one for loop instead of 3 "map" functions
              for (let i = 0; i < titleList.length; i++) {
                attachmentsArr.push({
                  title: titleList[i],
                  contentType: "linkAttachment",
                  imageHTML: images[i],
                  websiteURL: urlList[i]
                });
              }
              messageData.attachments = attachmentsArr;
            }
          }

          if (messageData.type == "answer") {
            messageData.waitForReply = true;
          }

          // If message has links (is a claimmessage or imagelink), get the appropriate links
          messageData.linkInfo = [];
          let links = [];

          if (messageData.type == "claimmessage") {
            links = messageData.links;
          } else if (messageData.type == "imagelink") {
            links = messageData.imagelink_link;
          }

          links.map(link => {
            messageData.linkInfo.push(this.getMessageData(link));
          });

          newMessages.push(messageData);
        });

        //Get suggested actions of final message
        let lastMessage = newMessages.length > 0 ? newMessages.length - 1 : 0;
        newMessages[lastMessage].suggestedActions = [];
        newMessages[lastMessage].suggested_actions.map(action => {
          let suggestedAction = {};
          let suggestedAction = this.getMessageData(action, this.user);

          if (suggestedAction.type != "answer") {
            newMessages[lastMessage].suggestedActions.push({
              type: suggestedAction.type,
              value: suggestedAction.text,
              link: suggestedAction.link,
              codename: suggestedAction.codename
            });
          } else {
            newMessages[lastMessage].waitForReply = true;
            newMessages[lastMessage].heldAction = {
              codename: suggestedAction.codename
            };
          }
        });

        messages.push(...newMessages);

        // console.log(messages);

        //set the state with the updated message array. This will populate messages in chat.
        this.setState({
          messages: messages
        });
      });
    }
  };

  /*
   * Capture the response event and trigger response actions.
   */
  addNewMessage = event => {
    //Author: Anish
    const responseText = event.message.text.toLowerCase();
    this.addNewResponse(responseText);
  };

  render() {
    return (
      <div className="unum-conversation-wrapper">
        {this.state.displayConversations && (
          <div>
            <h1>{this.state.conversations.instructions}</h1>
            <br />
            {this.state.conversations.choices.map((choice, i) => (
              <div style={{ marginBottom: 10 }} key={i}>
                <Button
                  onClick={() => {
                    this.selectConversation(choice);
                  }}
                >
                  {choice
                    .split("_")
                    .join(" ")
                    .toUpperCase()}
                </Button>
              </div>
            ))}
          </div>
        )}
        {!this.state.displayConversations && (
          <Chat
            user={this.user}
            messages={this.state.messages}
            onMessageSend={this.addNewMessage}
            placeholder={"Type or ask me something"}
            messageTemplate={MessageTemplate} //Author: Anish
            message={this.CustomChatMessage} //Author: Anish
            attachmentTemplate={AttachmentTemplate} //Author: Anish
            width={380}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("my-app"));

// fetch(this.kentoAPILink)
//   .then(resp => resp.json())
//   .then(data => {
//     const itemSize = data.items.length;
//     //finding name of desired flow in items[]
//     let desiredFlow = Number(
//       prompt("Which flow would you like? Pick a number 0-x")
//     );
//     let flowName;
//     for (let i = 0; i < itemSize; i++) {
//       if (data.items[i].system.type == "conversationoptions") {
//         //sets the name of the flow based on the one you select
//         if (
//           !data.items[i].elements.conversation_flows_options.value[
//             desiredFlow
//           ]
//         ) {
//           alert("INVALID INPUT: The page will restart.");
//           location.href = location.href;
//         } else {
//           flowName =
//             data.items[i].elements.conversation_flows_options.value[
//               desiredFlow
//             ];
//           //alert(flowName);
//         }
//         break; //once you have the flow name, you can exit the loop
//       }
//     }

//     let messagesArr = [];
//     messagesArr = this.state.messages.slice();
//     //finds the right flow to work with based on selection
//     for (let i = 0; i < itemSize; i++) {
//       //if the item is the flow item desired
//       if (data.items[i].system.codename == flowName) {
//         //go through array of initial message names for a particular flow
//         for (
//           let j = 0;
//           j < data.items[i].elements.messages.value.length;
//           j++
//         ) {
//           //finding each message in items based on the message's name
//           for (let k = 0; k < itemSize; k++) {
//             //if the item is the message desired
//             if (
//               data.items[k].system.codename ==
//               data.items[i].elements.messages.value[j]
//             ) {
//               let suggestedActionsArr = [];

//               //looping through the suggested actions of a given message
//               for (
//                 let h = 0;
//                 h < data.items[k].elements.suggested_actions.value.length;
//                 h++
//               ) {
//                 //looping through items to find suggested actions
//                 for (let m = 0; m < itemSize; m++) {
//                   //if item is desired suggested action
//                   if (
//                     data.items[k].elements.suggested_actions.value[h] ==
//                     data.items[m].system.codename
//                   ) {
//                     suggestedActionsArr.push({
//                       type: data.items[m].elements.type.value,
//                       value: data.items[m].elements.text.value
//                     });
//                   }
//                 }
//               }
//               //checks if there is an image embedded or not
//               let imageHTML = "";
//               if (data.items[k].elements.rich_text.value != "<p><br></p>") {
//                 imageHTML = data.items[k].elements.rich_text.value;
//                 messagesArr.push({
//                 author: this.bot,
//                 timestamp: new Date(),
//                 text: data.items[k].elements.text.value + "<div style = 'text-align: center'>" + imageHTML + "</div",
//                 suggestedActions: suggestedActionsArr
//               });
//               }
//               else {
//                 messagesArr.push({
//                 author: this.bot,
//                 timestamp: new Date(),
//                 text: data.items[k].elements.text.value,
//                 suggestedActions: suggestedActionsArr
//               });
//               }
//             }

//             this.setState({
//               messages: messagesArr
//             });
//           }
//         }
//         break; //once you find the right flow name, you can break
//       }
//     }
//   })
//   .catch(console.log("error in retrieving data while mounting"));

// addNewMessage = event => {
//   // console.log(event);
//   fetch(this.kentoAPILink)
//     .then(resp => resp.json())
//     .then(data => {
//       const responseText = event.message.text.toLowerCase();

//       this.setState(prevState => ({
//         messages: [...prevState.messages, event.message]
//       }));

//       let botResponse = Object.assign({}, event.message);
//       botResponse.author = this.bot;
//       botResponse.suggestedActions = [];

//       let responseIsSuggested = false;
//       //searching through items
//       for (let i = 0; i < data.items.length; i++) {
//         //if item is a suggested action
//         if (data.items[i].system.type == "suggested_action") {
//           //if the user input matches a suggested action
//           if (
//             data.items[i].elements.text.value.toLowerCase() == responseText
//           ) {
//             responseIsSuggested = true;
//             //search through items
//             for (let j = 0; j < data.items.length; j++) {
//               //if item is the message/flow that the suggested action links to
//               if (
//                 data.items[j].system.codename ==
//                 data.items[i].elements.link.value[0]
//               ) {
//                 //if suggested action links to a message
//                 if (data.items[j].system.type == "message") {
//                   //setting values for the message response
//                   botResponse.type = data.items[j].elements.type.value;
//                   botResponse.url = data.items[j].elements.timeline_image_link.value;
//                   botResponse.imageHTML = data.items[j].elements.rich_text.value;
//                   //if message is a date response or not
//                   if((responseText) == 'submit date' || (responseText) == ' submit date ')  {
//                     botResponse.text = "The date you submitted was: " + this.state.messages[this.state.messages.length - 2].dateresponse + data.items[j].elements.text.value;
//                   } else {
//                     botResponse.text = data.items[j].elements.text.value;
//                   }

//                   //Get all the values for the claimmessage type
//                   if (data.items[j].elements.type.value === "claimmessage") {

//                     let claimInfo = data.items[j].elements;
//                     let keys = Object.keys(claimInfo);

//                     const newobj = Object.assign({},...keys.map(key => ({[key]: claimInfo[key].value})));

//                     botResponse.claim = newobj

//                     //get the links
//                     if (botResponse.claim.links) {
//                       botResponse.claim.linkInfo = [];
//                       for(let l = 0; l < data.items.length; l++) {
//                         botResponse.claim.links.map(link => {
//                             if(data.items[l].system.codename === link ) {
//                               let keys = Object.keys(data.items[l].elements);
//                               const linkObj = Object.assign({},...keys.map(key => ({[key]: data.items[l].elements[key].value})));

//                               botResponse.claim.linkInfo.push(linkObj);
//                             }
//                           })
//                       }
//                     }

//                     console.log(botResponse);
//                   }

//                   //loop through suggested actions of specified message
//                   for (
//                     let k = 0;
//                     k < data.items[j].elements.suggested_actions.value.length;
//                     k++
//                   ) {
//                     //loop through items finding each suggested action
//                     for (let h = 0; h < data.items.length; h++) {
//                       //if item is the specified suggested actions
//                       if (
//                         data.items[h].system.codename ==
//                         data.items[j].elements.suggested_actions.value[k]
//                       ) {
//                         botResponse.suggestedActions.push({
//                           type: data.items[h].elements.type.value,
//                           value: data.items[h].elements.text.value
//                         });
//                       }

//                     }
//                   }

//                 } else if (data.items[j].system.type == "conversationflow") {
//                   //if it links to a flow
//                   location.href = location.href;
//                 }
//               }
//             }
//             break;
//           }
//         }
//       }
//       if (!responseIsSuggested) {
//         botResponse.text = this.countReplayLength(event.message.text);
//         botResponse.suggestedActions.push({
//           type: "reply",
//           value: "Restart"
//         });
//       }

//       setTimeout(() => {
//         this.setState(prevState => ({
//           messages: [...prevState.messages, botResponse]
//         }));
//       }, 1000);
//     })
//     .catch(function() {
//       console.log("Error with fetching from kentico kontent");
//     });
// };

// countReplayLength = question => {
//   let length = question.length;
//   let answer = "Please use the suggested responses for the demo.";
//   return answer;
// };
