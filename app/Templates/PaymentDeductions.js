import React, { useState } from "react";
import './templateCSS.css';

export default function PaymentDeductions(props) {
  return (
    <div className="k-bubble">
      <div>
        <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={ props.data.description } />
        {
          props.data.linkInfo.map((link, i) => (
            <div style={{marginTop: 0, marginBottom: 5, display: 'flex'}} key={i}>
              <span style={{width: 210}}>{link.title}</span>
              <div style={{marginLeft: 10, color: 'darkred', fontWeight: 'bold'}}>{link.amount}</div>
            </div>
          ))
        }
        
      </div>
    </div>
  )
}