// components/ServicesViewModal.tsx
import React from 'react';
import { Modal, Button, Table, TableColumn, TableHeader, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";
import { Edit, Trash2, CalendarClockIcon } from "lucide-react";
import { Customer, Service } from './types';

interface ServicesViewModalProps {
  visible: boolean;
  onClose: () => void;
  services: Service[];
  loadingOnModal: boolean;
  selectedCustomer: Customer | null;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onCreateReminder: (service: Service) => void;
}

export default function ServicesViewModal({
  visible,
  onClose,
  services,
  loadingOnModal,
  selectedCustomer,
  onEditService,
  onDeleteService,
  onCreateReminder,
}: ServicesViewModalProps) {
  return (
    <Modal isOpen={visible} onClose={onClose} size="5xl">
      <ModalContent>
        <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
          <h2 style={{ margin: 6 }}>Services for {selectedCustomer?.name}</h2>
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
            <TableBody
              loadingContent={<Spinner label="Loading..." color='current' />}
              isLoading={loadingOnModal}
            >
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.paymentType}</TableCell>
                  <TableCell>{`${service.periodPrice} ${service.currency}`}</TableCell>
                  <TableCell>{`${service.startingDate.toString().split('T')[0]}`}</TableCell>
                  <TableCell>{`${service.endingDate.toString().split('T')[0]}`}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="light"
                      onPress={() => onEditService(service)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => onDeleteService(service)}
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button
                      isIconOnly
                      color="default"
                      variant="light"
                      onPress={() => onCreateReminder(service)}
                    >
                      <CalendarClockIcon size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ModalContent>
    </Modal>
  );
}