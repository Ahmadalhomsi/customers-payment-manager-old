"use client";

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Spacer, DatePicker, Table, Popover, TableColumn, TableHeader, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import { MailIcon } from '@/components/MailIcon';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  price: string;
  currency: string;
  paymentStart: string;
  paymentEnd: string;
}

interface CustomerFormData extends Omit<Customer, 'id'> { }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visible, setVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    price: '',
    currency: 'USD',
    paymentStart: '',
    paymentEnd: '',
  });

  // Fetch customers on component load
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await axios.get('/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
    fetchCustomers();
  }, []);

  const openModal = (customer: Customer | null = null) => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        price: customer.price,
        currency: customer.currency,
        paymentStart: customer.paymentStart,
        paymentEnd: customer.paymentEnd,
      });
      setSelectedCustomer(customer);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        price: '',
        currency: 'USD',
        paymentStart: '',
        paymentEnd: '',
      });
      setSelectedCustomer(null);
    }
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  const openDeleteConfirm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteConfirmVisible(true);
  };

  const closeDeleteConfirm = () => setDeleteConfirmVisible(false);

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
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedCustomer) {
        // Update customer
        await axios.put(`/api/customers/${selectedCustomer.id}`, formData);
        setCustomers((prev) => prev.map(c => c.id === selectedCustomer.id ? { ...selectedCustomer, ...formData } : c));
      } else {
        // Create customer
        const response = await axios.post('/api/customers', formData);
        setCustomers([...customers, response.data]);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
    closeModal();
  };

  const handleDelete = async () => {
    try {
      if (selectedCustomer) {
        await axios.delete(`/api/customers/${selectedCustomer.id}`);
        setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    closeDeleteConfirm();
  };

  return (
    <div>
      <Button onPress={() => openModal(null)}>Create Customer</Button>

      {/* Customer Table */}
      <Table aria-label="Customers Table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.price} {customer.currency}</TableCell>
              <TableCell>
                <Button onPress={() => openModal(customer)}>Edit</Button>
                <Button color="warning" onPress={() => openDeleteConfirm(customer)}>Delete</Button>
                <Button onPress={() => alert(`Service for ${customer.name}`)}>Add Service</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Customer Modal */}
      <Modal isOpen={visible} onClose={closeModal}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>{selectedCustomer ? 'Edit Customer' : 'Create Customer'}</h2>
            <Input label="Customer Name" placeholder="Enter name" name="name" fullWidth value={formData.name} onChange={handleChange} />
            <Spacer y={1} />
            <Input type="email" label="Email" placeholder="Enter email" name="email" fullWidth value={formData.email} onChange={handleChange} endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            } />
            <Spacer y={1} />
            <Input type="tel" label="Phone Number" placeholder="Enter phone number" name="phone" fullWidth value={formData.phone} onChange={handleChange} />
            <Spacer y={1} />
            <Input type="number" label="Price" placeholder="Enter price" name="price" fullWidth value={formData.price} onChange={handleChange} />
            <Spacer y={1} />
            <DatePicker label="Payment Start Date" onChange={(date) => handleDateChange('paymentStart', date as unknown as Date)} />
            <Spacer y={1} />
            <DatePicker label="Payment End Date" onChange={(date) => handleDateChange('paymentEnd', date as unknown as Date)} />
            <Spacer y={1} />
            <Button onPress={handleSubmit}>{selectedCustomer ? 'Update' : 'Create'}</Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirmVisible} onClose={closeDeleteConfirm}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>Are you sure you want to delete this customer?</h2>
            <Button onPress={handleDelete}>Yes, delete</Button>
            <Button onPress={closeDeleteConfirm}>Cancel</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
