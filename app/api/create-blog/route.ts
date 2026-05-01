import { NextResponse } from "next/server";

//api endpoint example using api routes
export async function POST(){
    //logic here
    console.log("hello from the server");

    return NextResponse.json({success: true});
}