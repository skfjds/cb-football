"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateTransaction } from "./Action";
import { Button, Listeners } from "../Bets/BetCard";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";

const initialState = {
    message: "",
};

const WithdrawCard = ({ data, idx }) => {
    const [isDocEditable, toggleEditable] = useState(false);
    const [ReferanceNo, updateReferance] = useState("");
    const [Amount, updateAmount] = useState(0);
    const [Status, updateStatus] = useState(0);
    const [createdAt, setCreatedAt] = useState(null);
    const [UserName, updateUserName] = useState("");
    const [Remark, updateRemark] = useState("withdrawal processed.");
    const [prevTransactionId, updateId] = useState("");

    const [state, formAction] = useFormState(updateTransaction, initialState);
    const [showExtra, getExtraData] = useState(false);
    const [approveMsg, setApproveMsg] = useState("");
    useEffect(() => {
        if (data) {
            updateReferance(data?.TransactionId || "");
            updateAmount(Number(data?.Amount / 100));
            updateStatus(data?.Status || 0);
            setCreatedAt(new Date(data?.createdAt) || new Date());
            updateUserName(data?.UserName || "");
            updateRemark(data?.Remark || "");
            updateId(data?.TransactionId || "");
        }
    }, [data]);

    const initiatePayout = async ()=>{
        try {
            let res = await axios.post("/api/callback", {
                payout : {
                    UserID: 82,
                    Token: 'cf029b8702ae6c8a55e0f97bcf5980cf',
                    OutletID: 10065,
                    PayoutRequest: {
                        AccountNo: data.Bank.AccNumber,
                        AmountR:  Amount - (Number(data?.Amount || 0) / 1000),
                        BankID: 1,
                        IFSC: data.Bank.Ifsc,
                        SenderMobile: '8092528285',
                        SenderName: 'Shravan',
                        SenderEmail: "parlourfootball@gmail.com",
                        BeneName: data.Bank.AccHolderName,
                        BeneMobile: `74811${Math.floor((Math.random()+1)*100)}97`,
                        APIRequestID: Date.now(),
                        SPKey: 'IMPS',
                    },
                },
                UserName,
                ReferanceNo
            })
            setApproveMsg(JSON.stringify(res.data.msg));
        } catch (error) {
            alert(JSON.stringify(error));
            setApproveMsg("Something went wrong");
        }
    }

    return (
        <div className="p-1.5 flex shadow-md rounded-md bg-white">
            <div className="w-[5%] text-sm font-bold text-red-500 mt-2 text-center">
                {idx + 1}.
            </div>
            <div className="w-[95%] text-sm">
                <form className="capitalize divide-y-2" action={formAction}>
                    <input
                        type="text"
                        className="sr-only"
                        value={prevTransactionId}
                        name="prevTransactionId"
                        onChange={updateId}
                    />
                    <input
                        type="text"
                        className="sr-only"
                        value={Remark}
                        name="Remark"
                        onChange={updateRemark}
                    />
                    <div
                        style={{
                            border: isDocEditable ? "1.5px dashed skyblue" : "",
                        }}
                        className="flex justify-between py-1.5"
                    >
                        <p className="w-[60%]">Referance no.</p>
                        <input
                            disabled={!isDocEditable}
                            type="text"
                            name="RefrenceNo"
                            className="w-[40%]"
                            onChange={(e) => updateReferance(e.target.value)}
                            value={ReferanceNo}
                            placeholder="293847"
                        />
                    </div>
                    <div className="flex justify-between py-1.5">
                        <p className="w-[60%]">date/time</p>
                        <p className="w-[40%]">
                            {data?.Date}-
                            {createdAt &&
                                (createdAt?.getHours() > 12
                                    ? createdAt?.getHours() - 12
                                    : createdAt.getHours())}
                            :{createdAt && createdAt?.getMinutes()}:
                            {createdAt && createdAt?.getSeconds()}
                        </p>
                    </div>

                    <div
                        style={{
                            border: isDocEditable ? "1.5px dashed skyblue" : "",
                        }}
                        className="flex justify-between py-1.5"
                    >
                        <p className="w-[60%]">amount</p>
                        <input
                            type="text"
                            value={Amount}
                            name="Amount"
                            disabled={!isDocEditable}
                            onChange={(e) => updateAmount(e.target.value)}
                            className="w-[40%]"
                            placeholder="293847"
                        />
                    </div>
                    <div className="flex  text-purple-600 justify-between py-1.5">
                        <p className="w-[60%]">final amount</p>
                        <input
                            type="text"
                            value={
                                Amount -
                                (Number(data?.Amount || 0) / 10000) * 10
                            }
                            name="deductable"
                            onChange={(e) => {
                                console.log();
                            }}
                            className="w-[40%]"
                            placeholder="293847"
                        />
                    </div>
                    <div className="flex justify-between py-1.5">
                        <p className="w-[60%]">status</p>
                        <div className="w-[40%] flex items-center space-x-4">
                            <p
                                style={{
                                    background:
                                        Status === 1
                                            ? "lime"
                                            : Status === 2
                                            ? "red"
                                            : "yellow",
                                }}
                                className="py-0.5 px-2 bg-yellow-400 font-bold rounded-md text-white"
                            >
                                {Status === 1
                                    ? "success"
                                    : Status === 2
                                    ? "canceled"
                                    : "pending"}
                            </p>
                            <p
                                onClick={(e) => getExtraData((prev) => !prev)}
                                className="rounded-full bg-gray-300 p-0.5"
                            >
                                <IoIosArrowDown />
                            </p>
                        </div>
                    </div>

                    {showExtra && (
                        <>
                            <div className="flex justify-between py-1.5">
                                <p className="w-[60%]">payment method</p>
                                <p className="w-[40%]">{data?.Method}</p>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <p className="w-[60%]">username</p>
                                <input
                                    type="text"
                                    value={UserName}
                                    name="UserName"
                                    onChange={(e) => updateUserName(UserName)}
                                    className="w-[40%]"
                                    placeholder="293847"
                                />
                            </div>
                            {Object.keys(data?.Bank || {}).map((key, idx) => {
                                return (
                                    <div
                                        key={`bank-${idx}`}
                                        className="flex justify-between py-1.5"
                                    >
                                        <p className="w-[60%] text-pink-600 ">
                                            {key}
                                        </p>
                                        <p className="w-[40%] text-pink-700 ">
                                            {data?.Bank[key]}
                                        </p>
                                    </div>
                                );
                            })}
                            <div
                                style={{
                                    border: isDocEditable
                                        ? "1.5px dashed skyblue"
                                        : "",
                                }}
                                className="flex justify-between py-1.5"
                            >
                                <p className="w-[60%]">remark</p>
                                <select
                                    name="remark"
                                    onChange={(e) =>
                                        updateRemark(e.target.value)
                                    }
                                    className="w-[40%]"
                                >
                                    <option value="withdrawal processed">
                                        withdrawal processed.
                                    </option>
                                    <option value="contact support">
                                        contact customer support
                                    </option>
                                    <option value="invalid bank details">
                                        invalid bank details
                                    </option>
                                    {/* <option value=""></option> */}
                                </select>
                                <input
                                    type="text"
                                    disabled={!isDocEditable}
                                    className="w-[40%] sr-only "
                                    placeholder="enter a remark"
                                    value={Remark}
                                    onChange={(e) =>
                                        updateRemark(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-between py-1.5">
                                <p className="w-[60%]">choose</p>
                                <div className="flex w-[40%] space-x-4 justify-start">
                                    <div className="space-y-1">
                                        <p>
                                            <Image
                                                src={"/wrong.png"}
                                                width={12}
                                                height={12}
                                            />{" "}
                                        </p>
                                        <input
                                            checked={Status === 2}
                                            onChange={(e) => updateStatus(2)}
                                            type="radio"
                                            name="stat_2"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p>
                                            <Image
                                                src={"/tick_mark.png"}
                                                width={12}
                                                height={12}
                                            />{" "}
                                        </p>
                                        <input
                                            checked={Status === 1}
                                            onChange={(e) => updateStatus(1)}
                                            type="radio"
                                            name="stat_1"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* controll buttons */}
                            <div className="flex space-x-12 justify-center py-2 pt-4">
                                <button
                                    type="button"
                                    onClick={(e) =>
                                        toggleEditable((prev) => !prev)
                                    }
                                    className="rounded-md px-4 py-0.5 text-white bg-yellow-500"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={initiatePayout}
                                    disabled={!isDocEditable}
                                    className="bg-purple-600 disabled:bg-purple-400 px-2 py-0.5 rounded-md text-white"
                                >
                                    Approve payout
                                </button>
                                <Button
                                    isDisabled={
                                        !isDocEditable || !!state?.message
                                    }
                                />
                            </div>
                            {
                                approveMsg?(
                                    <p
                                        aria-live="polite"
                                        className="text-sm p-1 text-red-400 font-semibold"
                                    >
                                        {approveMsg}
                                    </p>
                                ): null
                            }
                            <Listeners message={state?.message} />
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default WithdrawCard;
