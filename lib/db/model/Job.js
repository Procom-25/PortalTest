import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true
});

// Create a compound unique index on company and title
jobSchema.index({ company: 1, title: 1 }, { unique: true });

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
