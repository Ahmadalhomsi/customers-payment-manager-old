import prisma from '@/lib/prisma';  // Import the prisma instance from the file
import { NextResponse } from 'next/server';


export async function POST(req) {

    const data = await req.json();

    const { name, description, paymentType, periodPrice, currency, customerID
    } = data;

    let { startingDate, endingDate } = data;

    // console.log("----------------------------");
    // console.log(startingDate);
    // console.log(endingDate);


    // startingDate = new Date(startingDate);
    // endingDate = new Date(endingDate);

    startingDate = new Date(startingDate.year, startingDate.month - 1, startingDate.day + 1);
    endingDate = new Date(endingDate.year, endingDate.month - 1, endingDate.day + 1);

    console.log(startingDate);
    console.log(endingDate);

    console.log("----------------------------");


    try {
        const service = await prisma.service.create({
            data: {
                name,
                description,
                paymentType,
                periodPrice,
                currency,
                startingDate,
                endingDate,
                endingDate,
                customerID
            }
        });


        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const services = await prisma.service.findMany();
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}


