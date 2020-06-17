import React, { useState } from "react";
import './templateCSS.css';
import { Dialog, DialogActionsBar, Window } from '@progress/kendo-react-dialogs';

export default function ClaimMessage(props) {
  console.log(props.data)
  const message = props.data;
  const imagehtml = props.data.imagehtml;

  const [visibleDialog, toggleDialog] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
// <div style={{display: 'inline-block',  float: 'left', verticalAlign: 'bottom'}} dangerouslySetInnerHTML={status.status_image[0].url} />
// <div className="gray-circle">
//               <span className="k-icon k-i-dollar dollar-icon"></span>
              
//             </div>
  return (
    <div className="k-card" style={{paddingTop:0}}>
          <div style={{marginTop:0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, display: 'inline-block', }}>
            
            <img style={{ boxShadow: '0px 0px 0px 0px' }} src={message.title_icon} />
            <p className="claim-title">{message.title}</p>
          </div>
          <div style={{marginLeft: 45, paddingBottom: 0}}>
            <span className="claim-description">{message.description}</span>
            <br/>


            {
              message.statuses.map((status, i) => (
                
                <div key={i}>
                  <div style={{paddingTop: 12, marginBottom: 0}}>
                    <img style={{ boxShadow: '0px 0px 0px 0px' }} src={status.status_image[0].url} />
                    { (status.secondary_title == '') &&
                      <span style={{color: '#525252', fontWeight: 'bold', marginLeft: 6}}>{status.status_title}</span>
                    } 
                    { (status.secondary_title != '') &&
                    <div style={{display: 'inline-block', marginLeft: 6, verticalAlign: 'top'}}>
                      <span style={{color: '#525252', fontWeight: 'bold', }}>{status.status_title}</span><br/>
                      <span style={{color: '#525252', fontWeight: 'bold'}}>{status.secondary_title}</span>
                    </div>
                    }
                  </div>

                  {
                    status.linkInfo.map((link, j) => (
                      <div style={{marginTop: 0}} key={j}>
                        <div style={{marginLeft: 40}}>
                          <button className="claim-button" onClick={() => {
                            setModalInfo(link)
                            toggleDialog(!visibleDialog);
                            }}
                          >{link.linktitle} </button>
                          <br/>
                          <span>{link.linkdescription}</span>
                        </div>
                        { (j < status.linkInfo.length - 1) &&
                          <div className="link-line"/>
                        }
                      </div>
                  ))
                }
                { (i < message.statuses.length - 1) &&
                  <div className="link-line"/>
                }
              </div>
              ))
            }
            {visibleDialog && <Dialog title={modalInfo.linktitle} onClose={() => toggleDialog(!visibleDialog)} width={375} height={500}>
                    <p style={{ margin: "20px" }}>{modalInfo.linkinfo}</p>
                    
                </Dialog>}
            
            </div>
        </div>

  )
}

// {
//               message.linkInfo.map((link, i) => (
//                 <div style={{marginTop: 0}} key={i}>
//                   <div style={{marginLeft: 30}}>
//                     <button className="claim-button" onClick={() => {
//                       setModalInfo(link)
//                       toggleDialog(!visibleDialog);
//                       }}
//                     >{link.linktitle} </button>
//                     <br/>
//                     <span>{link.linkdescription}</span>
//                   </div>
//                   { (i < message.linkInfo.length - 1) &&
//                     <div className="link-line"/>
//                   }
//                 </div>
//               ))
//             }