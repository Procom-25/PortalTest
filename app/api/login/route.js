import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { conn } from '@/lib/db';
import { Company } from '@/lib/model/Company';

export async function POST(request) {
    try {
        // Establish DB connection
        await mongoose.connect(conn);
        
        // Parse the incoming request body
        const { name, password } = await request.json();

        // Look for the company in the database
        const company = await Company.findOne({ name });

        // Handle case if the company doesn't exist
        if (!company) {
            return NextResponse.json({ error: 'Company doesn’t exist' }, { status: 401 });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, company.password);

        // If password doesn’t match, return an error
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // If everything is correct, return a success message
        return NextResponse.json({ message: "Login successful", success: true });

    } catch (error) {
        // Return an error response if something goes wrong
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
