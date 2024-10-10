// components/CustomerModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Spacer } from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import { Customer, CustomerFormData } from './types';

interface CustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: CustomerFormData) => void;
  selectedCustomer: Customer | null;
}

export default function CustomerModal({ visible, onClose, onSubmit, selectedCustomer }: CustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({ name: selectedCustomer.name, email: selectedCustomer.email, phone: selectedCustomer.phone });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [selectedCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalContent>
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: 6 }}>{selectedCustomer ? 'Edit Customer' : 'Create Customer'}</h2>
          <Input label="Name" placeholder="Enter name" name="name" value={formData.name} onChange={handleChange} />
          <Spacer y={1} />
          <Input label="Email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
          <Spacer y={1} />
          <Input label="Phone" placeholder="Enter phone" name="phone" value={formData.phone} onChange={handleChange} />
          <Spacer y={1} />
          <Button onPress={handleSubmit}>Submit</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}