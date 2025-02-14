import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";
import { JobApplication } from "@/lib/db/model/JobApplication";

export async function GET(request)
{
    await mongoose.connect(conn);
    const jobApplications = await JobApplication.find({});

    return NextResponse.json({ success: true, data: jobApplications }, { status: 200 });



}