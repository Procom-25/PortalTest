import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { conn } from '@/lib/db/db';
import { Job } from "@/lib/db/model/Job"
import { URL } from 'url';



export async function POST(request) {
    try {
        await mongoose.connect(conn);
        const data = await request.json();

        const newJob = new Job({
            title: data.title,
            company: data.company,
            description: data.description,
        });

        const savedJob = await newJob.save();

        return NextResponse.json({ result: savedJob });

    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Handle duplicate key error
            return NextResponse.json({ error: 'A job with this title already exists for the specified company.' }, { status: 409 }); // Conflict
        } else {
            // Handle other unexpected server errors
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function PUT(request) {
    try {
        await mongoose.connect(conn);
        const data = await request.json();

        console.log(data)

        // Validate required fields are present
        if (!data.title || !data.company || !data.description) {
            return NextResponse.json({ error: 'title, company, and description are required' }, { status: 400 });
        }

        // Filter by title and company, update the description
        const updateResult = await Job.updateOne(
            { title: data.title, company: data.company }, // Filter
            { $set: { description: data.description } } // Update
        );

        // Interpret the update result
        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: 'No job found matching the title and company' }, { status: 404 });
        } else if (updateResult.modifiedCount > 0) {
            return NextResponse.json({ message: 'Job description updated successfully' });
        } else {
            return NextResponse.json({ message: 'No changes made (description might be the same)' }, { status: 200 });
        }

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