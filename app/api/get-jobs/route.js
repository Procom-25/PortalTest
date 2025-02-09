import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";
import { JobsAppliedd } from "@/lib/db/model/jobs-appliedd";

export async function GET(request) {
    try {
        console.log("API Route Hit:", request.url);

        const { searchParams } = new URL(request.url);
        const company = searchParams.get("company");

        console.log("Query Params:", { company });

        if (!company) {
            return NextResponse.json({ error: "Company is required" }, { status: 400 });
        }

        await mongoose.connect(conn);

        const appliedJobs = await JobsAppliedd.find({ company: company });

        return NextResponse.json({ result: appliedJobs });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
