import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conn } from '@/lib/db/db';
import { Job } from "@/lib/db/model/Job"
import { URL } from 'url';

import date from 'date-and-time';


export async function POST(request) {
    try {
        await mongoose.connect(conn);
        const data = await request.json();

        console.log("Date: " + date.parse(data.applicationDeadline))

        const newJob = new Job({
            title: data.title,
            company: data.company,
            description: data.description,
            status: data.status,
            applicationDeadline: date.parse(data.applicationDeadline),
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

export async function DELETE(request) {
    await mongoose.connect(conn);

    const url = new URL(request.url);
    const company = url.searchParams.get('company');
    const title = url.searchParams.get('title');

    if (!company || !title) {
        return NextResponse.json({ error: 'Both company and title are required' }, { status: 400 });
    }

    const query = { company, title };

    const deletionResult = await Job.deleteOne(query);

    if (deletionResult.deletedCount === 0) {
        return NextResponse.json({ message: 'No job found matching the criteria' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
}