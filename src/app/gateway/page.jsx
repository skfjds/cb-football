"use client"
import { useState } from "react";
import { sign } from "../api/payment/gateway/signApi";
import axios from "axios";



export default function Page(){
  const [userID, setUserID] = useState(81);
  const [token, setToken] = useState("9ea127a71dc32e6315995bf16845a242");
  const [outletID, setOutletID] = useState(10064);
  const [accountNo, setAccountNo] = useState("6083000100106919");
  const [amountR, setAmountR] = useState(101);
  const [bankID, setBankID] = useState(1);
  const [ifsc, setIfsc] = useState("PUNB0608300");
  const [senderMobile, setSenderMobile] = useState("8092528285");
  const [senderName, setSenderName] = useState("Shravan");
  const [senderEmail, setSenderEmail] = useState("parlourfootball@gmail.com");
  const [beneName, setBeneName] = useState("Himanshu kumar");
  const [beneMobile, setBeneMobile] = useState("7481071197");
  const [spKey, setSpKey] = useState("IMPS");
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
      try {
          setLoading(true);
          let res = await axios.post("api/callback", {
            UserID: userID,
            Token: token,
            OutletID: outletID,
            PayoutRequest: {
                AccountNo: accountNo,
                AmountR: amountR,
                BankID: bankID,
                IFSC: ifsc,
                SenderMobile: senderMobile,
                SenderName: senderName,
                SenderEmail: senderEmail,
                BeneName: beneName,
                BeneMobile: beneMobile,
                APIRequestID: Date.now(),
                SPKey: spKey,
            },
        })
          console.log(res);
          alert(JSON.stringify(res.data));
      } catch (error) {
          alert(error);
      } finally {
          setLoading(false);
      }
  };
 return <></>
  return (
      <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center mb-4">Payment Gateway</h1>
          
          <div className="mb-4">
              <label htmlFor="userID" className="block text-sm font-medium text-gray-700">User ID</label>
              <input 
                  id="userID" 
                  type="number" 
                  value={userID} 
                  onChange={(e) => setUserID(parseInt(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">Token</label>
              <input 
                  id="token" 
                  type="text" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="outletID" className="block text-sm font-medium text-gray-700">Outlet ID</label>
              <input 
                  id="outletID" 
                  type="number" 
                  value={outletID} 
                  onChange={(e) => setOutletID(parseInt(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700">Account Number</label>
              <input 
                  id="accountNo" 
                  type="text" 
                  value={accountNo} 
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="amountR" className="block text-sm font-medium text-gray-700">Amount</label>
              <input 
                  id="amountR" 
                  type="number" 
                  step="0.01" 
                  value={amountR} 
                  onChange={(e) => setAmountR(parseFloat(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="bankID" className="block text-sm font-medium text-gray-700">Bank ID</label>
              <input 
                  id="bankID" 
                  type="number" 
                  value={bankID} 
                  onChange={(e) => setBankID(parseInt(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700">IFSC</label>
              <input 
                  id="ifsc" 
                  type="text" 
                  value={ifsc} 
                  onChange={(e) => setIfsc(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="senderMobile" className="block text-sm font-medium text-gray-700">Sender Mobile</label>
              <input 
                  id="senderMobile" 
                  type="text" 
                  value={senderMobile} 
                  onChange={(e) => setSenderMobile(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">Sender Name</label>
              <input 
                  id="senderName" 
                  type="text" 
                  value={senderName} 
                  onChange={(e) => setSenderName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">Sender Email</label>
              <input 
                  id="senderEmail" 
                  type="email" 
                  value={senderEmail} 
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="beneName" className="block text-sm font-medium text-gray-700">Beneficiary Name</label>
              <input 
                  id="beneName" 
                  type="text" 
                  value={beneName} 
                  onChange={(e) => setBeneName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="beneMobile" className="block text-sm font-medium text-gray-700">Beneficiary Mobile</label>
              <input 
                  id="beneMobile" 
                  type="text" 
                  value={beneMobile} 
                  onChange={(e) => setBeneMobile(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>
          <div className="mb-4">
              <label htmlFor="spKey" className="block text-sm font-medium text-gray-700">Sp Key</label>
              <input 
                  id="spKey" 
                  type="text" 
                  value={spKey} 
                  onChange={(e) => setSpKey(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>
          <button 
              onClick={initiatePayment} 
              className={`w-full py-2 mt-4 text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md`}
              disabled={loading}
          >
              {loading ? 'Processing...' : 'Pay Now'}
          </button>
      </div>
  );
}

