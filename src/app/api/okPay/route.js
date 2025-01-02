import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT (request, response){
    try {
        const body = await request.text();

        const data = await axios.post('https://api.wpay.one/v1/Collect', body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return NextResponse.json({data: data.data});

    } catch (error) {
        console.log(error);
    }
}

export async function POST (request, response){
    try {
        const body = await request.text();
        console.log("Ok pay body", body);
        return NextResponse.json('success');
    } catch (error) {
        console.log("okay pay calback",error);
    }
}