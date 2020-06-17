import React from "react";

export default function IconReply(props) {
  return (
    <div className="k-card" style={{padding: 20}}>
      <div style={{ textAlign: 'center', marginBottom: 5, marginTop: 10 }}>
        <img src={props.data.imagehtml} style={{ boxShadow: '0px 0px 0px 0px' }} />
        <div dangerouslySetInnerHTML={props.data.iconTitle}/>
      </div>
      <div dangerouslySetInnerHTML={props.data.iconText} />
      
    </div>
  )
}