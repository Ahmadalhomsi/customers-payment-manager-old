import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const services = await prisma.service.findMany({
            where: { customerID: id },
        });
        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { name, email } = await req.json();
    try {
        const service = await prisma.service.update({
            where: { id: id },
            data: { name, email },
        });
        return NextResponse.json(service, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        await prisma.service.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: 'service deleted' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}