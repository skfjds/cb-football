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
import crypto, { randomBytes } from 'crypto';
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
  
/**
 * {"tradeResult":"1","oriAmount":"100.00","amount":"100.00","mchId":"100333078","orderNo":"1000065484115","mchOrderNo":"85749324","sign":"a112aaf80bb0cc13b1828fc43765850f","signType":"MD5","orderDate":"2024-12-18 00:31:38"}
 */
export async function POST(request, response) {
  
  await connect();
  
  let Session = await mongoose.startSession();
  Session.startTransaction();
  
  try {

    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;

    const rawBody = await request.text();

    // Parse the URL-encoded body
    const params = new URLSearchParams(rawBody);

    // Convert the parsed data into an object
    const body = Object.fromEntries(params);
   
    console.log("Parsed Body:", body);

    const {
      tradeResult="", oriAmount=0, amount=1, mchId="", mchOrderNo=1, orderDate='' } = body

    if(Number(oriAmount) !== Number(amount) && Number(tradeResult) !== 1 
      && Number(mchId) !== merchantId
    ){
      // its failure
      await TRANSACTION.findOneAndDelete({TransactionId: `${mchOrderNo}`});
      await Session.abortTransaction();
      return NextResponse.json("failure")
    }  

    const amm_updated = oriAmount * 100;

    const isTransactionUpdated = await TRANSACTION.findOneAndUpdate({
      TransactionId: `${mchOrderNo}`
      },{
        $set: {
          Status : 1,
          Amount: amm_updated,
          Remark: "successfull",
          Type: "deposit",
        }
      }, {session: Session});



    let isFirstDeposit = await USER.findOne({ UserName: isTransactionUpdated?.UserName });

    if (isFirstDeposit?.Parent !== "") {
      let isParentUpdated = await USER.findOneAndUpdate(
          { UserName: isFirstDeposit?.Parent },
          {
              $inc: {
                  Balance: amm_updated * 0.06,
                  Members: isFirstDeposit?.FirstDeposit ? 1 : 0,
              },
          },
          { session: Session }
      );
      if (!isParentUpdated)
          throw new Error(
              "somoething went wrong while updating the parent"
          );
      let today = new Date();

      let createBonusReward = await TRANSACTION.create(
          [
              {
                  UserName: isParentUpdated?.UserName,
                  TransactionId:  randomBytes(15).toString("hex").slice(0, 15),
                  Amount: amm_updated * 0.06,
                  Type: "invitation reward",
                  Remark: "success",
                  Status: 1,
                  Date: `${today.getDate()}/${
                      today.getMonth() + 1
                  }/${today.getFullYear()}`,
                  Parent: isParentUpdated?.Parent,
                  From: isFirstDeposit?.UserName,
                  Method: "reward",
              },
          ],
          { session: Session }
      );

      if (!createBonusReward) throw Error("Failed To Update Parent");
    }

    let userUpdated = await USER.findOneAndUpdate(
      { UserName: isFirstDeposit?.UserName },
        {
            $inc: {
                Balance: amm_updated + amm_updated * 0.04,
                Deposited: amm_updated,
                ValidDeposit: amm_updated,
            },
            FirstDeposit: false,
            VipLevel: 1,
        },
        { session: Session }
    );
    if(!userUpdated) throw new Error('');

    await Session.commitTransaction();
    return new NextResponse('success', {status: 200});
    
  } catch (error) {
    console.log(error);
    if (error?.code === 500 || error?.status === 500 || !error?.status) {
      ErrorReport(error);
    }
    
    await Session.abortTransaction();

    return new NextResponse('failure', {status: 400 });

  }
}
