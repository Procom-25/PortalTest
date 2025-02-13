import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";
import { JobApplication } from "@/lib/db/model/JobApplication";

export async function GET(request) {
  // ✅ Named export for GET method
  try {
    console.log("API Route Hit:", request.url);

    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");
    const job_title = searchParams.get("job_title");

    console.log("Query Params:", { company, job_title });

    if (!company || !job_title) {
      return NextResponse.json({ resumes: [] });
    }

    await mongoose.connect(conn);

    const appliedJobs = await JobApplication.find({
      company: company,
      job: job_title, // Changed from job_title to job to match schema
    });

    console.log("DB Jobs[appliedJobs]:", appliedJobs);

    // Remove this check since find() always returns an array (empty if no matches)
    // if (!appliedJobs) {
    //     return NextResponse.json({ resumes: [] });
    // }

    return NextResponse.json({ resumes: appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json({ resumes: [] });
  }
}
