import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { JobApplication } from "@/lib/db/model/JobApplication";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "procom-job-portal-storage";
const BUCKET_REGION = "eu-north-1"; // Ensure this matches your AWS region
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/`;

async function UploadToS3Bucket(file, filename) {
  const filebuffer = file;
  console.log(filename);
  const timestamp = new Date().toISOString();

  // Get file extension and base filename
  const fileExtension = filename.split(".").pop().toLowerCase();
  const baseFilename = filename.replace(/\.[^/.]+$/, ""); // Remove extension

  // Allowed file types
  const mimeTypes = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  if (!mimeTypes[fileExtension]) {
    throw new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
  }

  // Unique filename for S3
  const objectKey = `${baseFilename}-${Date.now()}-${timestamp}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: filebuffer,
    ContentType: mimeTypes[fileExtension],
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  // Construct Object URL
  const objectURL = `${S3_BASE_URL}${encodeURIComponent(objectKey)}`;
  return objectURL;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume");
    const email1 = formData.get("email");
    const name1 = formData.get("name");
    const companyName = formData.get("company");
    const jobName = formData.get("job_title");

    // Connect to MongoDB if not connected
    await mongoose.connect(conn);
    const buffer = Buffer.from(await resume.arrayBuffer());
    const objectURL = await UploadToS3Bucket(buffer, resume.name);
    console.log(formData);
    // Store application in database

    const jobApplication = new JobApplication({
      email: email1,
      name: name1,
      company: companyName,
      job: jobName,
      cv_url: objectURL,
      applied_at: new Date(),
    });

    await jobApplication.save();
    console.log(jobApplication);

    return NextResponse.json({
      message: "Application submitted successfully",
      objectURL,
      showNotification: true,
      notificationType: "success",
      notificationMessage: "Application successfully submitted!",
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to submit application",
        showNotification: true,
        notificationType: "error",
        notificationMessage: error.message || "Failed to submit application",
      },
      { status: 500 }
    );
  }
}
