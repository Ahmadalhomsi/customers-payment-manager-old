import { NextResponse } from 'next/server';


export async function GET(req, {params}) {
    const { id } = params;

    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
        });
        if (customer) {
            return NextResponse.json(customer, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }
}

export async function PUT(req, {params}) {
    const { id } = params;
    const { name, email } = await req.json();
    try {
        const customer = await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, email },
        });
        return NextResponse.json(customer, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}

export async function DELETE(req, {params}) {
    const { id } = params;
    try {
        await prisma.customer.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }
}