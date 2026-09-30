import { TDataLogin } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest)=>{
    try{
         const userData = await request.json() as TDataLogin
         

    }catch(error){
       await NextResponse.json({massage:"serveree error"} , {status: 500})
    }
}