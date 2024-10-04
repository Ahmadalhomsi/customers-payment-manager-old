"use client"

import React, { useState, useEffect } from 'react';
import {
  Modal, Button, Input, Spacer, Table, Select, SelectItem,
  TableColumn, TableHeader, TableBody, TableRow, TableCell, Tooltip, DatePicker
} from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import axios from 'axios';
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { format, parseISO } from 'date-fns'; // Optional, using date-fns for formatting
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";


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
  startingDate: DateValue;
  endingDate: DateValue;
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
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [servicesViewModalVisible, setServicesViewModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({ name: '', email: '', phone: '' });
  const today = new Date();
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    paymentType: 'Monthly',
    periodPrice: 0,
    currency: 'TL',
    startingDate: parseDate(format(today, 'yyyy-MM-dd')),
    endingDate: parseDate(format(today, 'yyyy-MM-dd'))
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

  async function fetchServices(customerId: string) {
    try {
      const response = await axios.get(`/api/services?customerId=${customerId}`);
      setServices(response.data);
    } catch (error) {
      console.log('Error fetching services:', error);
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

  function formatDate(dateTime) {
  const date = new Date(dateTime);
  return date.toISOString().split('T')[0];
}

  const openServiceModal = (customer: Customer, service: Service | null = null) => {
    setSelectedCustomer(customer);
    if (service) {
      console.log(service);
      console.log(serviceFormData);

      setSelectedService(service);
      setServiceFormData({
        name: service.name,
        description: service.description,
        paymentType: service.paymentType,
        periodPrice: service.periodPrice,
        currency: service.currency,
        startingDate: parseDate(format(service.startingDate.toString().split('T')[0], 'yyyy-MM-dd')),
        endingDate: parseDate(format(service.endingDate.toString().split('T')[0], 'yyyy-MM-dd'))
      });
    } else {
      setSelectedService(null);
      setServiceFormData({
        name: '',
        description: '',
        paymentType: 'Monthly',
        periodPrice: 0,
        currency: 'TL',
        startingDate: parseDate(format(today, 'yyyy-MM-dd')),
        endingDate: parseDate(format(today, 'yyyy-MM-dd'))
      });
    }
    setServiceModalVisible(true);
  };

  const closeServiceModal = () => {
    setServiceModalVisible(false);
    setSelectedService(null);
  };

  const openServicesViewModal = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchServices(customer.id);
    setServicesViewModalVisible(true);
  };

  const closeServicesViewModal = () => setServicesViewModalVisible(false);

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

  const handleDateChange = (name: string, value: any) => {
    console.log(value);


    setServiceFormData({
      ...serviceFormData,
      [name]: value,
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
    try {
      if (selectedCustomer) {
        if (selectedService) {
          // Edit existing service
          await axios.put(`/api/services/${selectedService.id}`, {
            ...serviceFormData,
            customerID: selectedCustomer.id
          });
        } else {
          // Add new service
          await axios.post(`/api/services`, {
            ...serviceFormData,
            customerID: selectedCustomer.id
          });
        }
        closeServiceModal();
        if (servicesViewModalVisible) {
          await fetchServices(selectedCustomer.id);
        }
      }
    } catch (error) {
      console.log('Error adding/updating service:', error);
    }
  };

  return (
    <div>
      <Button onPress={() => openModal(null)} style={{ margin: 20 }}>Create Customer</Button>

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
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit customer">
                    <Button
                      isIconOnly
                      color="primary"
                      variant="light"
                      onPress={() => openModal(customer)}
                    >
                      <Edit size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete customer">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => openDeleteConfirmModal(customer)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Add service">
                    <Button
                      isIconOnly
                      color="success"
                      variant="light"
                      onPress={() => openServiceModal(customer)}
                    >
                      <Plus size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="View services">
                    <Button
                      isIconOnly
                      color="secondary"
                      variant="light"
                      onPress={() => openServicesViewModal(customer)}
                    >
                      <Eye size={18} />
                    </Button>
                  </Tooltip>
                </div>
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
            <Input label="Name" placeholder="Enter name" name="name" value={formData.name} onChange={handleChange} />
            <Spacer y={1} />
            <Input label="Email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
            <Spacer y={1} />
            <Input label="Phone" placeholder="Enter phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Spacer y={1} />
            <Button onPress={handleCustomerSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
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

      {/* Add/Edit Service Modal */}
      <Modal isOpen={serviceModalVisible} onClose={closeServiceModal}>
        <ModalContent>
          <div style={{ padding: '20px' }}>
            <h2>{selectedService ? 'Edit' : 'Add'} Service for {selectedCustomer?.name}</h2>
            <Input
              label="Service Name"
              placeholder="Enter service name"
              value={serviceFormData.name}
              onChange={(e) => handleServiceChange('name', e.target.value)}
            />
            <Spacer y={1} />
            <Input
              label="Description"
              placeholder="Enter service description"
              value={serviceFormData.description}
              onChange={(e) => handleServiceChange('description', e.target.value)}
            />
            <Spacer y={1} />
            <Input
              type="number"
              label="Price"
              placeholder="Enter price"
              value={serviceFormData.periodPrice.toString()}
              onChange={(e) => handleServiceChange('periodPrice', parseFloat(e.target.value))}
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
              defaultSelectedKeys={['Monthly']}
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
              value={serviceFormData.startingDate}
              onChange={(date) => handleDateChange('startingDate', date)}
            />
            <Spacer y={1} />
            <DatePicker
              label="Ending Date"
              value={serviceFormData.endingDate}
              onChange={(date) => handleDateChange('endingDate', date)}
            />
            <Spacer y={1} />
            <Button onPress={handleServiceSubmit}>Submit</Button>
          </div>
        </ModalContent>
      </Modal>

      {/* View Services Modal */}
      <Modal isOpen={servicesViewModalVisible} onClose={closeServicesViewModal} size="5xl">
        <ModalContent>
          <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
            <h2>Services for {selectedCustomer?.name}</h2>
            <Table aria-label="Services Table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Payment Type</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Start Date</TableColumn>
                <TableColumn>End Date</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.paymentType}</TableCell>
                    <TableCell>{`${service.periodPrice} ${service.currency}`}</TableCell>
                    <TableCell>{`${service.startingDate}`}</TableCell>
                    <TableCell>{`${service.endingDate}`}</TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="light"
                        onPress={() => {
                          closeServicesViewModal();
                          openServiceModal(selectedCustomer!, service);
                        }}
                      >
                        <Edit size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ModalContent>
      </Modal>

    </div>
  );
}