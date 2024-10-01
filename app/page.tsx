"use client"; // Add this to the top for client-side functionality in Next.js

import { useState } from 'react';
import { Modal, Button, Input, Spacer } from '@nextui-org/react';
import {ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio} from "@nextui-org/react";


interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  price: string;
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
    paymentStart: '',
    paymentEnd: '',
  });

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
            />
            <Spacer y={1} />
            <Input
              type="date"
              label="Payment Start Date"
              name="paymentStart"
              fullWidth
              value={formData.paymentStart}
              onChange={handleChange}
            />
            <Spacer y={1} />
            <Input
              type="date"
              label="Payment End Date"
              name="paymentEnd"
              fullWidth
              value={formData.paymentEnd}
              onChange={handleChange}
            />
            <Spacer y={1} />
            <Button onPress={handleSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
