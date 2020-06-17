import React, { useState } from "react";
import './templateCSS.css';
import { Dialog, DialogActionsBar, Window } from '@progress/kendo-react-dialogs';

const claimButton = {
    backgroundColor: 'transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
    color: '#1e88a6',
    fontSize: 15
}

export default function ImageLink(props) {

  const [visibleDialog, toggleDialog] = useState(false);
  const [modalInfo, setModalInfo] = useState({});


  return (
    <div id="imagelink" style={{paddingBottom: 0, padding: 0}} className="k-card">
          <div style={{height: 100, overflow: 'hidden', width: '100%', marginBottom: 10, borderRadius: '30px 30px 0px 0px'}}>
            <div style={{marginLeft: 0}} dangerouslySetInnerHTML={props.data.imagehtml} />
          </div>
          {
              props.data.message.linkInfo.map((link, i) => (
                <div style={{paddingLeft: 15, paddingRight: 5, paddingBottom: 15}} key={i}>
                  <div className="link-button" style={{textAlign: 'left'}}>
                    <a 
                      onClick={() => {
                        setModalInfo({
                          title: link.linktitle,
                          info: {__html: link.linkinfo}
                        })
                        toggleDialog(!visibleDialog);
                      }}
                    >{link.linktitle}</a>
                    <br/>
                    <span style={{}}>{link.linkdescription}</span>
                  </div>
                </div>
              ))
            }
            {visibleDialog && <Dialog title={modalInfo.title} onClose={() => toggleDialog(!visibleDialog)} width={375} height={500}>
                    <div style={{ marginLeft: 20}} dangerouslySetInnerHTML={props.data.imagehtml} />
                    <div style={{ margin: "20px" }} dangerouslySetInnerHTML={modalInfo.info} />
                    
                </Dialog>}
          
        </div>

  )
}