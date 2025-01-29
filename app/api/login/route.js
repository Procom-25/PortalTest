import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { conn } from '@/lib/db';
import { Company } from '@/lib/model/Company';

export async function POST(request) {
    try {
        await mongoose.connect(conn);
        
        const { name, password } = await request.json();  

        const company = await Company.findOne({ name });

        if (!company) {
            return NextResponse.json({ error: 'Company doesnt exist - 1' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, company.password);
        
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful" });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}