import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { JobApplication } from "../../../lib/db/model/JobApplication";
import stream from "stream";
import archiver from "archiver";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "procom-job-portal-storage";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");
    const jobTitle = searchParams.get("job_title");
    console.log(company , jobTitle)
    let query = {};
    if (company && jobTitle) {
      query = { company: company, job: jobTitle };
    }
    console.log(query)
    const applications = await JobApplication.find(query);
    const urls = applications.map((application) => application["cv_url"]);

    console.log(urls);

    // Create the ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Create a PassThrough stream
    const passThroughStream = new stream.PassThrough();
    archive.pipe(passThroughStream);

    // Process each URL and add to ZIP
    for (const url of urls) {
   

      const s3Url = new URL(url);
      const key = decodeURIComponent(s3Url.pathname.substring(1)); // Remove leading slash

      // Get the object from S3
      const { Body } = await s3.send(
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key })
      );

      // Add file to ZIP
      archive.append(Body, { name: key });
    }

    // Finalize the archive
    archive.finalize();

    // Return a streaming response
    return new Response(passThroughStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${company}-${jobTitle}-Applications.zip"`,
        "Content-Type": "application/zip",
      },
    });

    return new NextResponse();
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response(JSON.stringify({ error: "Error downloading file" }), {
      status: 500,
    });
  }
}
