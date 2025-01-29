import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Export the model as Company
export const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
