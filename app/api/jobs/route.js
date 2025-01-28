import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conn } from '@/lib/db';
import { Company } from '@/lib/model/Company';

export async function POST(request) {
    
    try {
        await mongoose.connect(conn);
        const data = await request.json();
        const newCompany = new Company({
            name: data.name,
            password: data.password,
        });

        const savedCompany = await newCompany.save();
        
        return NextResponse.json({ result: savedCompany });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

export async function GET() {
    await mongoose.connect(conn);

    const companies = await Company.find();

    return NextResponse.json({ result: companies });
}
