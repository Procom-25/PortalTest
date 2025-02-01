import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conn } from '@/lib/db';
import { Job } from '../../../lib/model/Job';
import { URL } from 'url';

export async function POST(request) {
    try {
        await mongoose.connect(conn);
        const data = await request.json();

        const newJob = new Job({
            title: data.title,
            company: data.company,
            description: data.description,
            status: data.status,
            applicationDeadline: data.applicationDeadline,
        });

        const savedJob = await newJob.save();

        return NextResponse.json({ result: savedJob });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await mongoose.connect(conn);

    const url = new URL(request.url);
    const company = url.searchParams.get('company');

    let query = {};

    if (company) {
        query = { company: company };
    }

    const jobs = await Job.find(query);

    return NextResponse.json({ result: jobs });
}