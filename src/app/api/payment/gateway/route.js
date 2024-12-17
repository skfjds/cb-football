import CustomError from "@/app/helpers/Error";
import ErrorReport from "@/app/helpers/ErrorReport";
import { isValidUser } from "@/app/helpers/auth";
import { getFormattedDate } from "@/app/helpers/formattedDate";
import { connect } from "@/app/modals/dbConfig";
import { TRANSACTION, USER } from "@/app/modals/modal";
import { mongoose } from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from 'axios';
import { sign } from "./signApi";
import crypto from 'crypto';
/**
 *
 *   This file will handle the deposits from various channels be it usdt or local;
 *
 */

export const validateSignByKey = (signSource, key, providedSign) => {
    if (key) {
      signSource += `&key=${key}`;
    }
    const generatedSign = crypto.createHash('md5').update(signSource).digest('hex');
    return generatedSign === providedSign;
  };
  

export async function GET(request) {
  
  await connect();
  
  let Session = await mongoose.startSession();
  Session.startTransaction();
  
  let { session, token } = await getCookieData();
  
  try {
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

    const UserName = await isValidUser(token, session);
    
    // if (!UserName)
    //   return NextResponse.json({
    //     status: 302,
    //     message: "Session Expired login again",
    //   });

    // let body = await request.json();
    
    // const {
    //     version, 
    //   } = body;

    // const merchant_key = process.env.NEXT_PUBLIC_M_KEY; // Set in .env file
    const merchant_key = '17b5c50afb3e40c8a989e85c543087d5'; // Set in .env file
    const reqUrl = 'https://pay.basepays.com/pay/web';
    const page_url = 'https://cb-football.com/';
    const notify_url = "http://cb-football.com/api/payment/deposit/";
    const pay_type = 151;
    const trade_amount = 100.00;
    const order_date = formatDate(new Date());
    const goods_name = 'test'
    const mch_return_msg = "hello its a test";
    const mch_order_no= `${Date.now()}`;
    const sign_type = 'MD5';
    const mch_id = 100333078;
    const version = '1.0';
    // Construct the sign string
    let signStr = `goods_name=${goods_name}&mch_id=${mch_id}&mch_order_no=${mch_order_no}&notify_url=${notify_url}&order_date=${order_date}&pay_type=${pay_type}&trade_amount=${trade_amount}&version=${version}`;

    const signature = sign(signStr, merchant_key);
   
    const postData = {
        goods_name,
        mch_id,
        mch_order_no,
        notify_url,
        order_date,
        pay_type,
        trade_amount,
        version,
        sign_type,
        sign: signature,
      };

      const data = await axios.post(reqUrl, postData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });


    // await Session.commitTransaction();
    console.log(data.data);
    // return NextResponse.json({
    //   status: 200,
    //   message:
    //     "Your deposit is in processing and will be reflected soon in you account .",
    //   data: data,
    // });

  } catch (error) {
    console.log(error);
    // if (error?.code === 500 || error?.status === 500 || !error?.status) {
    //   ErrorReport(error);
    // }
    
    await Session.abortTransaction();

    return NextResponse.json({
      status: error?.code || error?.status || 500,
      message: error?.message || "something went wrong",
      data: {},
    });
    
  }
}

async function getCookieData() {
  let token = cookies().get("token")?.value || "";
  let session = cookies().get("session")?.value || "";
  const cookieData = { token, session };
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000)
  );
}
