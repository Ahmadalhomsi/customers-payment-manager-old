// components/ServiceModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Spacer, Select, SelectItem } from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import { DatePicker } from '@nextui-org/react';
import { Customer, Service, ServiceFormData } from './types';
import { parseDate } from "@internationalized/date";

interface ServiceModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: ServiceFormData) => void;
    selectedCustomer: Customer | null;
    selectedService: Service | null;
}

const paymentTypes = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
];

const currencies = [
    { value: 'TL', label: '₺' },
    { value: 'USD', label: '$' },
    { value: 'EUR', label: '€' },
];

export default function ServiceModal({ visible, onClose, onSubmit, selectedCustomer, selectedService }: ServiceModalProps) {
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        description: '',
        paymentType: 'Monthly',
        periodPrice: 0,
        currency: 'TL',
        startingDate: parseDate(new Date().toISOString().split('T')[0]),
        endingDate: parseDate(new Date().toISOString().split('T')[0])
    });

    useEffect(() => {
        if (selectedService) {
            setFormData({
                name: selectedService.name,
                description: selectedService.description,
                paymentType: selectedService.paymentType,
                periodPrice: selectedService.periodPrice,
                currency: selectedService.currency,
                startingDate: selectedService.startingDate,
                endingDate: selectedService.endingDate
            });
        } else {
            setFormData({
                name: '',
                description: '',
                paymentType: 'Monthly',
                periodPrice: 0,
                currency: 'TL',
                startingDate: parseDate(new Date().toISOString().split('T')[0]),
                endingDate: parseDate(new Date().toISOString().split('T')[0])
            });
        }
    }, [selectedService]);

    const handleChange = (name: string, value: any) => {
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
                    <h2 style={{ margin: 6 }}>{selectedService ? 'Edit' : 'Add'} Service for {selectedCustomer?.name}</h2>
                    <Input
                        label="Service Name"
                        placeholder="Enter service name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <Spacer y={1} />
                    <Input
                        label="Description"
                        placeholder="Enter service description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                    <Spacer y={1} />
                    <Select
                        label="Payment Type"
                        placeholder="Select payment type"
                        value={formData.paymentType}
                        onChange={(e) => handleChange('paymentType', e.target.value)}
                    >
                        {paymentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </Select>
                    <Spacer y={1} />
                    <Input
                        type="number"
                        label={`${formData.paymentType} Price`}
                        placeholder="Enter price"
                        value={formData.periodPrice.toString()}
                        onChange={(e) => handleChange('periodPrice', parseFloat(e.target.value))}
                        endContent={
                            <div className="flex items-center">
                                <Select
                                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={(e) => handleChange('currency', e.target.value)}
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
                    <DatePicker
                        label="Starting Date"
                        value={formData.startingDate}
                        onChange={(date) => handleChange('startingDate', date)}
                    />
                    <Spacer y={1} />
                    <DatePicker
                        label="Ending Date"
                        value={formData.endingDate}
                        onChange={(date) => handleChange('endingDate', date)}
                    />
                    <Spacer y={1} />
                    <Button onPress={handleSubmit}>Submit</Button>
                </div>
            </ModalContent>
        </Modal>
    );
}