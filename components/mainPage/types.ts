// types.ts
import { DateValue } from "@internationalized/date";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  paymentType: string;
  periodPrice: number;
  currency: string;
  startingDate: DateValue;
  endingDate: DateValue;
  customerID: string;
}

export interface CustomerFormData extends Omit<Customer, 'id'> { }

export interface ServiceFormData extends Omit<Service, 'id' | 'customerID'> { }

export interface Reminder {
  id: string;
  scheduledAt: DateValue;
  status: ReminderStatus;
  serviceID: string;
  message?: string;

  createdAt: DateValue;
  updatedAt: DateValue;
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED'
}