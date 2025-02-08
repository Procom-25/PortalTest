import mongoose from 'mongoose';

const jobsAppliedSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },

    job: {
        type: String,
        required: true
    },

    cv_url: {
        type: String,
        required: true
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to prevent duplicate applications
jobsAppliedSchema.index({ email: 1, job: 1 }, { unique: true });

export const JobsAppliedd = mongoose.models.JobsAppliedd || mongoose.model('JobsAppliedd', jobsAppliedSchema);
