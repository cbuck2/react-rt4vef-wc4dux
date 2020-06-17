import React, { useState } from "react";
import "./templateCSS.css";
import {
  Dialog,
  DialogActionsBar,
  Window
} from "@progress/kendo-react-dialogs";

export default function ClaimMessage(props) {
  const message = props.data.message;
  const imagehtml = props.data.imagehtml;
  const [visibleDialog, toggleDialog] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  return (
    <div className="k-card" style={{ paddingTop: 0 }}>
      <div
        style={{
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          display: "inline-block"
        }}
      >
        <div className="gray-circle">
          <span className="k-icon k-i-dollar dollar-icon" />
        </div>
        <p className="claim-title">{message.title}</p>
      </div>
      <div style={{ marginLeft: 35, paddingBottom: 0 }}>
        <span className="claim-description">{message.description}</span>
        <br />
        <div style={{ paddingTop: 12, marginBottom: 0 }}>
          <div
            style={{
              display: "inline-block",
              float: "left",
              verticalAlign: "bottom"
            }}
            dangerouslySetInnerHTML={imagehtml}
          />
          <p
            style={{
              display: "inline-block",
              verticalAlign: "bottom",
              color: "black",
              marginLeft: 10,
              fontWeight: "bold"
            }}
          >
            {message.statustitle}
          </p>
        </div>

        {message.linkInfo.map((link, i) => (
          <div style={{ marginTop: 0 }} key={i}>
            <div style={{ marginLeft: 30 }}>
              <button
                className="claim-button"
                onClick={() => {
                  setModalInfo(link);
                  toggleDialog(!visibleDialog);
                }}
              >
                {link.linktitle}{" "}
              </button>
              <p style={{ marginLeft: 5 }}>{link.linkdescription}</p>
            </div>
            {i < message.linkInfo.length - 1 && <div className="link-line" />}
          </div>
        ))}
        {visibleDialog && (
          <Dialog
            title={modalInfo.linktitle}
            onClose={() => toggleDialog(!visibleDialog)}
            width={375}
            height={500}
          >
            <p style={{ margin: "20px" }}>{modalInfo.linkinfo}</p>
          </Dialog>
        )}
      </div>
    </div>
  );
}
