import React from "react";
import './templateCSS.css';

export default function PaymentDetails(props) {
  return (
    <div className="k-bubble">
      <div dangerouslySetInnerHTML={props.data.description} />
      <div className="separation-line"/>
      <div>
        <div style={{marginBottom: 5}} dangerouslySetInnerHTML={props.data.payPeriod} />
        <div dangerouslySetInnerHTML={props.data.related} />
      </div>
    </div>
  )
}