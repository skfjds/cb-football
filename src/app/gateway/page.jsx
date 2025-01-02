"use client"
import { useState } from "react";
import { sign } from "../api/payment/gateway/signApi";
import axios from "axios";



export default function Page(){
  const [mchId, setMchId] = useState(81);
  const [token, setToken] = useState("a84d45a9da414f0ba6152059330bf57a");
  const [out_trade_no, setout_trade_no] = useState(1719);
  const [money, setmoney] = useState(101);
  const [loading, setLoading] = useState(false);

  const okPay = async (amount, orderNo) => {
    setLoading(true);
    var urlencoded = new URLSearchParams();
    urlencoded.append("mchId", `${mchId}`);
    urlencoded.append("currency", "INR");
    urlencoded.append("out_trade_no", `${out_trade_no}`);
    urlencoded.append("pay_type", "UPI");
    urlencoded.append("money", `${money}`);
    urlencoded.append("attach", "userId");
    urlencoded.append("notify_url", "https://cb-football.com/api/okPay");
    urlencoded.append("returnUrl", "https://cb-football.com");
    
    const signature = sign(urlencoded.toString(), token);
    urlencoded.append("sign", signature);
    try {
        
        let data = await axios.put("/api/okPay", urlencoded);
        console.log(data);
        alert(data.data);
    } catch (error) {
       alert(JSON.stringify(error.message));   
    }

  }
  
  return (
      <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center mb-4">Payment Gateway</h1>
          
          <div className="mb-4">
              <label htmlFor="userID" className="block text-sm font-medium text-gray-700">Mch ID</label>
              <input 
                  id="mch id" 
                  type="number" 
                  value={mchId} 
                  onChange={(e) => setMchId(parseInt(e.target.value))}
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
              <label htmlFor="outletID" className="block text-sm font-medium text-gray-700">out trade number</label>
              <input 
                  id="outletID" 
                  type="number" 
                  value={out_trade_no} 
                  onChange={(e) => setout_trade_no(parseInt(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <div className="mb-4">
              <label htmlFor="amountR" className="block text-sm font-medium text-gray-700">Amount</label>
              <input 
                  id="amountR" 
                  type="number" 
                  step="0.01" 
                  value={money} 
                  onChange={(e) => setmoney(parseFloat(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
          </div>

          <button 
              onClick={okPay} 
              className={`w-full py-2 mt-4 text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md`}
              disabled={loading}
          >
              {loading ? 'Processing...' : 'Pay Now'}
          </button>
      </div>
  );
}

