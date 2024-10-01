"use client"; // Add this to the top for client-side functionality in Next.js

import { useState } from 'react';
import { Modal, Button, Input, Spacer, DatePicker } from '@nextui-org/react'; // Ensure you import DatePicker
import { ModalContent } from "@nextui-org/react";
import { MailIcon } from '@/components/MailIcon';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  price: string;
  currency: string;
  paymentStart: string;
  paymentEnd: string;
}

export default function CustomersPage() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    price: '',
    currency: 'USD', // Set default currency
    paymentStart: '',
    paymentEnd: '',
  });

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, value: Date) => {
    setFormData({
      ...formData,
      [name]: value.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here (e.g., POST request)
    console.log(formData);
    closeModal();
  };

  return (
    <div>
      <Button onPress={openModal}>Create Customer</Button>
      <Modal
        isOpen={visible} // Ensure this uses "isOpen" instead of "open"
        onClose={closeModal}
      >
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>Create a new customer</h2>
            <Input
              label="Customer Name"
              placeholder="Enter name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
            <Spacer y={1} />
            <Input
              type="email"
              label="Email"
              placeholder="Enter email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Spacer y={1} />
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter phone number"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
            />
            <Spacer y={1} />
            <Input
              type="number"
              label="Price"
              placeholder="Enter price"
              name="price"
              fullWidth
              value={formData.price}
              onChange={handleChange}
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="TL">₺</option>
                    <option value="USD">$</option>
                  </select>
                </div>
              }
            />
            <Spacer y={1} />
            <DatePicker
              label="Payment Start Date"
              className="max-w-[284px]"
              onChange={(date) => handleDateChange('paymentStart', date as unknown as Date)}
            />
            <Spacer y={1} />
            <DatePicker
              label="Payment End Date"
              className="max-w-[284px]"
              onChange={(date) => handleDateChange('paymentEnd', date as unknown as Date)}
            />
            <Spacer y={1} />
            <Button onPress={handleSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
