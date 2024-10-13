"use server"

// import cron from 'node-cron';
import prisma from '@/lib/prisma';
const { isSameDay } = require('date-fns');

// Schedule a payment
export async function schedulePaymentReminders() {

    const today = new Date();
    console.log('today', today);
    try {
        const payments = await prisma.reminder.findMany({
            where: {
                status: "SCHEDULED"
            }
        });
        console.log('payments', payments);
        console.log("today", today);
        console.log(isSameDay(payments[0].scheduledAt, today) ? 'Dates are on the same day' : 'Dates are on different days');
    } catch (error) {
        console.log('error', error);
    }


    // cron.schedule('* * * * *', async () => {
    //     const payment = await prisma.reminder.findMany({
    //         where: { status: "SCHEDULED" }
    //     });

    //     // if (new Date() >= scheduleDate && payment?.status === 'SCHEDULED') {
    //     //   // Logic for processing payment
    //     // //   await processPayment(paymentId);
    //     // }
    // });
};

// Cancel a scheduled payment
export const cancelPaymentReminder = async (reminderId: string) => {
    // Cancel payment logic
    await prisma.reminder.update({
        where: { id: reminderId },
        data: { status: 'CANCELED' }
    });
};

// Reschedule or modify a payment
export const reschedulePayment = async (reminderId: string, newDate: Date) => {
    // Update the schedule date in the database

    // await prisma.reminder.update({
    //     where: { id: reminderId },
    //     data: { schedule: newDate }
    // });

    // Add your logic for rescheduling the cron job here
};
