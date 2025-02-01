import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conn } from '@/lib/db/db';
import { Company } from '@/lib/db/model/Company';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        await mongoose.connect(conn);
        const data = await request.json();

        // Declare hashedPassword
        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const newCompany = new Company({
            name: data.name,
            password: hashedPassword,
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
