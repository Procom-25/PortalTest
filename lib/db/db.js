
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

// if (!MONGO_USERNAME || !MONGO_PASSWORD) {
//   throw new Error('MongoDB username or password is not defined in the environment variables');
// }

export const conn = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.e2drl.mongodb.net/JobPortal?retryWrites=true&w=majority&appName=Cluster0`;


// export const conn = "mongodb+srv://"+username+":"+password +"@cluster0.e2drl.mongodb.net/JobPortal?retryWrites=true&w=majority&appName=Cluster0"
