import React, { useState } from "react";
import './templateCSS.css';

export default function RecentPayments(props) {

  return (
    <div className="k-bubble">
      <div>
        <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={ props.data.description } />
        {
          props.data.linkInfo.map((link, i) => (
            <div key={i}>
              <div>
                { !link.showInfo &&
                <button className='claim-button' style={{fontSize: 16}} onClick={() => link.showInfo = link.showInfo ? false : true}>
                <span className="k-icon k-i-arrow-60-right" style={{fontSize: 12, marginRight: 4}}></span>
                {link.payment_date}
                </button>
                }
                { link.showInfo &&
                <button className='claim-button' style={{fontSize: 16}} onClick={() => link.showInfo = link.showInfo ? false : true}>
                <span className="k-icon k-i-arrow-60-down" style={{fontSize: 12, marginRight: 4}}></span>
                {link.payment_date}
                </button>
                }
                <span style={{float: 'right', fontWeight: 'bold', fontSize: 18, color: 'black', marginRight: 35}}>${link.amount}</span>
              </div>
              { link.showInfo &&
              <div style={{marginLeft: 10, paddingLeft: 10, marginTop: 10}}>
                <div>{link.pay_period}</div>
                <div style={{marginTop: 2}}>{link.related_to}</div>
              </div>
              }
              { (i < props.data.linkInfo.length - 1) &&
                    <div className="dropdown-line"/>
                  }
              
              
            </div>
          ))
        }
        
      </div>
    </div>
  )
}