import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: false
    },
});

// Export the model as Job
export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
