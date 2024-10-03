"use client";

import { useState, useEffect } from 'react';
import {
  Modal, Button, Input, Spacer, DatePicker, Table, Popover, TableColumn, TableHeader, TableBody, TableRow, TableCell,
  Select, SelectItem, DateValue
} from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import { MailIcon } from '@/components/MailIcon';
import axios from 'axios';


interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  paymentType: string;
  periodPrice: number;
  currency: string;
  startingDate: string;
  endingDate: string;
  customerID: string;
}

interface CustomerFormData extends Omit<Customer, 'id'> { }
interface ServiceFormData extends Omit<Service, 'id' | 'customerID'> { }

const paymentTypes = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
];

const currencies = [
  { value: 'TL', label: '₺' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visible, setVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({ name: '', email: '', phone: '' });
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    paymentType: 'Monthly',
    periodPrice: 0,
    currency: 'TL',
    startingDate: '',
    endingDate: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.log('Error fetching customers:', error);
    }
  }

  const openModal = (customer: Customer | null = null) => {
    if (customer) {
      setFormData({ name: customer.name, email: customer.email, phone: customer.phone });
      setSelectedCustomer(customer);
    } else {
      setFormData({ name: '', email: '', phone: '' });
      setSelectedCustomer(null);
    }
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  const openDeleteConfirmModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteConfirmVisible(true);
  };

  const closeDeleteConfirmModal = () => setDeleteConfirmVisible(false);

  const openServiceModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setServiceModalVisible(true);
  };

  const closeServiceModal = () => setServiceModalVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleServiceChange = (name: string, value: string | number) => {
    setServiceFormData({
      ...serviceFormData,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, value: DateValue) => {
    const newDate = value.toString();

    setServiceFormData({
      ...serviceFormData,
      [name]: newDate, // Convert DateValue to ISO string
    });
  };


  const handleCustomerSubmit = async () => {
    try {
      if (selectedCustomer) {
        await axios.put(`/api/customers/${selectedCustomer.id}`, formData);
      } else {
        await axios.post('/api/customers', formData);
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.log('Error submitting customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await axios.delete(`/api/customers/${selectedCustomer.id}`);
        fetchCustomers();
        closeDeleteConfirmModal();
      } catch (error) {
        console.log('Error deleting customer:', error);
      }
    }
  };

  const handleServiceSubmit = async () => {
    console.log('serviceFormData:', serviceFormData);
    console.log('selectedCustomer:', selectedCustomer);
    const formattedServiceFormData = {
      ...serviceFormData,
      customerID: selectedCustomer?.id
    };
    try {
      if (selectedCustomer) {
        await axios.post(`/api/services`, formattedServiceFormData);
        closeServiceModal();
      }
    } catch (error) {
      console.log('Error adding/updating service:', error);
    }
  };

  return (
    <div>
      <Button onPress={() => openModal(null)}>Create Customer</Button>

      <Table aria-label="Customers Table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                <Button onPress={() => openModal(customer)}>Edit</Button>
                <Button color="warning" onPress={() => openDeleteConfirmModal(customer)}>Delete</Button>
                <Button onPress={() => openServiceModal(customer)}>Add Service</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={visible} onClose={closeModal}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>{selectedCustomer ? 'Edit Customer' : 'Create Customer'}</h2>
            <Input label="Name" placeholder="Enter name" name="name" fullWidth value={formData.name} onChange={handleChange} />
            <Spacer y={1} />
            <Input label="Email" placeholder="Enter email" name="email" fullWidth value={formData.email} onChange={handleChange} />
            <Spacer y={1} />
            <Input label="Phone" placeholder="Enter phone" name="phone" fullWidth value={formData.phone} onChange={handleChange} />
            <Spacer y={1} />
            <Button onPress={handleCustomerSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteConfirmVisible} onClose={closeDeleteConfirmModal}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedCustomer?.name}?</p>
            <Button color="danger" onPress={handleDeleteCustomer}>Delete</Button>
            <Button onPress={closeDeleteConfirmModal}>Cancel</Button>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={serviceModalVisible} onClose={closeServiceModal}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>Add Service for {selectedCustomer?.name}</h2>
            <Input
              label="Service Name"
              placeholder="Enter service name"
              fullWidth
              value={serviceFormData.name}
              onChange={(e) => handleServiceChange('name', e.target.value)}
            />
            <Spacer y={1} />
            <Input
              label="Description"
              placeholder="Enter service description"
              fullWidth
              value={serviceFormData.description}
              onChange={(e) => handleServiceChange('description', e.target.value)}
            />
            <Spacer y={1} />
            <Input
              type="text"
              label="Price"
              placeholder="Enter price"
              fullWidth
              value={new Intl.NumberFormat().format(serviceFormData.periodPrice)}
              onChange={(e) => {
                const value = parseFloat(e.target.value.replace(/,/g, ''));
                handleServiceChange('periodPrice', isNaN(value) ? '' : value);
              }}
              endContent={
                <div className="flex items-center">
                  <Select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                    value={serviceFormData.currency}
                    onChange={(e) => handleServiceChange('currency', e.target.value)}
                    style={{ width: '40px' }} // Set a fixed width
                  >
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              }
            />

            <Spacer y={1} />
            <Select
              label="Payment Type"
              placeholder="Select payment type"
              value={serviceFormData.paymentType}
              onChange={(e) => handleServiceChange('paymentType', e.target.value)}
            >
              {paymentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            <Spacer y={1} />
            <DatePicker
              label="Starting Date"
              onChange={(date) => handleDateChange('startingDate', date)}
            />
            <Spacer y={1} />
            <DatePicker
              label="Ending Date"
              onChange={(date) => handleDateChange('endingDate', date)}
            />
            <Spacer y={1} />
            <Button onPress={handleServiceSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}