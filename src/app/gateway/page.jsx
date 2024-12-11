"use client"
import { sign } from "../api/payment/gateway/signApi";
import axios from "axios";
import crypto from 'crypto';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
export default function Page(){

    const test = async () => {
        const merchant_key = '17b5c50afb3e40c8a989e85c543087d5'; // Set in .env file
        const reqUrl = 'https://pay.basepays.com/pay/web';
        const page_url = 'https://cb-football.com/api/payment/deposit/';
        const order_date = formatDate(new Date());
        const notify_url = `https://cb-football.com/api/payment/withdraw`; 
        const pay_type = 151;
        const trade_amount = 100.00;
        const goods_name = 'test'
        const mch_order_no= `${Math.floor(Math.random() * 10000)}${Math.floor(Math.random() * 10000)}`;
        const sign_type = 'MD5';
        const mch_id = 100333078;
        const version = '1.0';
        // Construct the sign string
        let signStr = `goods_name=${goods_name}&mch_id=${mch_id}&mch_order_no=${mch_order_no}&notify_url=${notify_url}&order_date=${order_date}&page_url=${page_url}&pay_type=${pay_type}&trade_amount=${trade_amount}&version=${version}`;
    
        const signature = sign(signStr, merchant_key);
       
        const postData = {
            goods_name,
            mch_id,
            mch_order_no,
            notify_url,
            order_date,
            page_url,
            pay_type,
            trade_amount,
            version,
            sign_type,
            sign: signature,
          };
    
          const data = await axios.post(reqUrl, postData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 1000 * 60
          });
          console.log(data);
          if(data.data?.respCode === 'SUCCESS'){
            window.open(data.data.payInfo);
          }
    }

    return (
        <div>
            testing things out 
            <button onClick={()=>test()}>click</button>
        </div>
    )
}