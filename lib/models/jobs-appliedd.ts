interface JobApplication {
  email: string;
  name: string;
  company: string; // Company ObjectId
  job: string; // Job ObjectId
  cv_url: string;
  applied_at: Date;
}
