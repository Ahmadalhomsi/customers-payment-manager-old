// CustomersPage.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import axios from 'axios';
import CustomerTable from '../components/mainPage/CustomerTable';
import CustomerModal from '../components/mainPage/CustomerModal';
import DeleteConfirmModal from '../components/mainPage/DeleteConfirmModal';
import ServiceModal from '../components/mainPage/ServiceModal';
import ServicesViewModal from '../components/mainPage/ServicesViewModal';
import { Customer, Service, CustomerFormData, ServiceFormData, Reminder } from '../components/mainPage/types';
import { format } from 'date-fns';
import { parseDate } from '@internationalized/date';
import ReminderModal from '../components/mainPage/ReminderModal';


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [deleteCustomerConfirmVisible, setDeleteCustomerConfirmVisible] = useState(false);
  const [deleteServiceConfirmVisible, setDeleteServiceConfirmVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [servicesViewModalVisible, setServicesViewModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOnModal, setLoadingOnModal] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: 'asc' | 'desc' } | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);


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
    setLoading(false);
  }

  async function fetchServices(customerId: string) {
    setLoadingOnModal(true);
    try {
      const response = await axios.get(`/api/services/${customerId}`);
      setServices(response.data);
    } catch (error) {
      console.log('Error fetching services:', error);
    }
    setLoadingOnModal(false);
  }

  const handleCustomerSubmit = async (formData: CustomerFormData) => {
    try {
      if (selectedCustomer) {
        await axios.put(`/api/customers/${selectedCustomer.id}`, formData);
      } else {
        await axios.post('/api/customers', formData);
      }
      fetchCustomers();
      setCustomerModalVisible(false);
    } catch (error) {
      console.log('Error submitting customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await axios.delete(`/api/customers/${selectedCustomer.id}`);
        fetchCustomers();
        setDeleteCustomerConfirmVisible(false);
      } catch (error) {
        console.log('Error deleting customer:', error);
      }
    }
  };

  const handleDeleteService = async () => {
    if (selectedService) {
      try {
        await axios.delete(`/api/services/${selectedService.id}`);
        fetchServices(selectedService.customerID);
        setDeleteServiceConfirmVisible(false);
      } catch (error) {
        console.log('Error deleting service:', error);
      }
    }
  };

  const handleServiceSubmit = async (serviceFormData: ServiceFormData) => {
    try {
      if (selectedCustomer) {
        if (selectedService) {
          await axios.put(`/api/services/${selectedService.id}`, {
            ...serviceFormData,
            customerID: selectedCustomer.id
          });
        } else {
          await axios.post(`/api/services`, {
            ...serviceFormData,
            customerID: selectedCustomer.id
          });
        }
        setServiceModalVisible(false);
        if (servicesViewModalVisible) {
          await fetchServices(selectedCustomer.id);
        }
      }
    } catch (error) {
      console.log('Error adding/updating service:', error);
    }
  };

  const sendSMTPemail = async () => {
    try {
      const res = await axios.post('/api/mailer')
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending email:', error);
    }
  }

  async function fetchReminders(serviceId: string) {
    try {
      const response = await axios.get(`/api/reminders/${serviceId}`);
      setReminders(response.data);
    } catch (error) {
      console.log('Error fetching reminders:', error);
    }
  }

  const handleReminderSubmit = async (reminderData: Partial<Reminder>) => {
    try {
      if (selectedReminder) {
        await axios.put(`/api/reminders/${selectedReminder.id}`, reminderData);
      } else if (selectedService) {
        await axios.post('/api/reminders', { ...reminderData, serviceID: selectedService.id });
      }
      if (selectedService) {
        await fetchReminders(selectedService.id);
      }
      setReminderModalVisible(false);
    } catch (error) {
      console.log('Error submitting reminder:', error);
    }
  };


  return (
    <div>
      <Button onPress={() => setCustomerModalVisible(true)} style={{ margin: 20, backgroundColor: "#f26000" }}>Create Customer</Button>
      <Button onPress={sendSMTPemail} style={{ margin: 20, backgroundColor: "#f26000" }}>Send an email</Button>
      <Button onPress={() => setReminderModalVisible(true)} style={{ margin: 20, backgroundColor: "#f26000" }}>Create Reminder</Button>


      <CustomerTable
        customers={customers}
        loading={loading}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setCustomerModalVisible(true);
        }}
        onDelete={(customer) => {
          setSelectedCustomer(customer);
          setDeleteCustomerConfirmVisible(true);
        }}
        onAddService={(customer) => {
          setSelectedCustomer(customer);
          setServiceModalVisible(true);
        }}
        onViewServices={(customer) => {
          fetchServices(customer.id);
          setSelectedCustomer(customer);
          // if (customer.services)
          //   setServices(customer.services)
          setLoadingOnModal(false)
          setServicesViewModalVisible(true);
        }}
      />

      <CustomerModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        onSubmit={handleCustomerSubmit}
        selectedCustomer={selectedCustomer}
      />

      <DeleteConfirmModal
        visible={deleteCustomerConfirmVisible}
        onClose={() => setDeleteCustomerConfirmVisible(false)}
        onConfirm={handleDeleteCustomer}
        itemName={selectedCustomer?.name}
        itemType="customer"
      />

      <DeleteConfirmModal
        visible={deleteServiceConfirmVisible}
        onClose={() => setDeleteServiceConfirmVisible(false)}
        onConfirm={handleDeleteService}
        itemName={selectedService?.name}
        itemType="service"
      />

      <ServiceModal
        visible={serviceModalVisible}
        onClose={() => setServiceModalVisible(false)}
        onSubmit={handleServiceSubmit}
        selectedCustomer={selectedCustomer}
        selectedService={selectedService}
      />

      <ServicesViewModal
        visible={servicesViewModalVisible}
        onClose={() => {
          setServicesViewModalVisible(false)
          setServices([]);
        }}
        services={services}
        loadingOnModal={loadingOnModal}
        selectedCustomer={selectedCustomer}
        onEditService={(service: any) => {
          service = {
            ...service,
            startingDate: parseDate(format(service.startingDate.toString().split('T')[0], 'yyyy-MM-dd')),
            endingDate: parseDate(format(service.endingDate.toString().split('T')[0], 'yyyy-MM-dd')),
          }
          setSelectedService(service);
          setServicesViewModalVisible(false);
          setServiceModalVisible(true);
        }}
        onDeleteService={(service: any) => {
          setSelectedService(service);
          setServicesViewModalVisible(false);
          setDeleteServiceConfirmVisible(true);
        }}
      />

      <ReminderModal
        visible={reminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
        onSubmit={handleReminderSubmit}
        selectedReminder={selectedReminder}
      />
    </div>
  );
}