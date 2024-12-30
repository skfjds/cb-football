import { connect } from "@/app/modals/dbConfig";
import { TRANSACTION } from "@/app/modals/modal";
import axios from "axios";
import md5 from "md5";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request, res) {
    let body = await request.json();

    let response = await axios.post("https://airdexpay.com/API/Payout", body.payout);
    let responseJson = response.data;
    if(responseJson.statuscode === 1 && responseJson.opening > responseJson.closing){
    
        await connect();
        let Session = await mongoose.startSession();
        Session.startTransaction();
        try {
            let isWithdrawUpdated = await TRANSACTION.findOneAndUpdate(
                {
                    UserName: body.UserName,
                    Type: "withdrawal",
                    TransactionId: body?.ReferanceNo,
                },
                {
                    Status: 1,
                    Remark: "withdrawal processed",
                },
                { session: Session }
            );
            if (isWithdrawUpdated) {
                await Session.commitTransaction();
                return NextResponse.json({msg: "settled"})
            } else {
                throw Error("error while seettling withdrawal");
            }
        } catch (error) {
            await Session.abortTransaction();
            console.log(error);
        }

    }

    return NextResponse.json({ msg : responseJson });
    
}
