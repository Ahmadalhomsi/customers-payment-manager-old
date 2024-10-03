import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
    const { id } = params;

    try {
        const service = await prisma.service.findUnique({
            where: { id: Number(id) },
        });
        if (service) {
            return NextResponse.json(service, { status: 200 });
        } else {
            return NextResponse.json({ error: 'service not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

export async function PUT(req, {params}) {
    const { id } = params;
    const { name, email } = await req.json();
    try {
        const service = await prisma.service.update({
            where: { id: Number(id) },
            data: { name, email },
        });
        return NextResponse.json(service, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req, {params}) {
    const { id } = params;
    try {
        await prisma.service.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}