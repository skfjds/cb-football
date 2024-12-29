import axios from "axios";
import md5 from "md5";
import { NextResponse } from "next/server";

export async function POST(request, res) {
    let body = await request.json();

    let response = await axios.post("https://airdexpay.com/API/Payout", body);
    let responseJson = response.data;

    return NextResponse.json({ data: responseJson });
    
}
