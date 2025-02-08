import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";
import { JobsAppliedd } from "@/lib/db/model/jobs-appliedd";

export async function GET(request) {  // ✅ Named export for GET method
    try {
        console.log("API Route Hit:", request.url);

        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const company = searchParams.get("company");

        console.log("Query Params:", { email, company });

        if (!email || !company) {
            return NextResponse.json({ error: "Missing email or company" }, { status: 400 });
        }

        await mongoose.connect(conn);

        const appliedJobs = await JobsAppliedd.find({
            email: email,
            company: company
        });

        console.log("DB Jobs:", appliedJobs);

        return NextResponse.json({ jobs: appliedJobs });

    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
