import React from 'react';
import {
  Modal,
  Button,
  ModalContent,
  Table,
  Spacer,
  ModalHeader,
  ModalFooter,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Spinner
} from '@nextui-org/react';
import { Reminder } from './types'; // Assuming Reminder contains fields like scheduledAt, status, message, etc.
import { format } from 'date-fns';
import { Edit, Trash2, Plus } from 'lucide-react';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  reminders: Reminder[]; // List of reminders for the selected service
  onCreateNewReminder: () => void;
  onEditReminder: (reminder: Reminder) => void;
  onDeleteReminder: (reminder: Reminder) => void;
  loading: boolean; // Optional: To handle loading state
}

export default function ReminderViewModal({
  visible,
  onClose,
  reminders,
  onCreateNewReminder,
  onEditReminder,
  onDeleteReminder,
  loading, // Optional: To handle loading state
}: ReminderModalProps) {
  return (
    <Modal isOpen={visible} onClose={onClose} size="2xl">
      <ModalHeader>
        <h3>Service Reminders</h3>
      </ModalHeader>

      <ModalContent>

        {/* Display a table of reminders */}
        <Table aria-label="Service Reminders" color="warning">
          <TableHeader>
            <TableColumn>Scheduled At</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody loadingContent={<Spinner label="Loading..." color="current" />} isLoading={loading}>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>{format(new Date(reminder.scheduledAt.toString()), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{reminder.status}</TableCell>
                <TableCell>{reminder.message}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Edit reminder">
                      <Button isIconOnly color="primary" variant="light" onPress={() => onEditReminder(reminder)}>
                        <Edit size={18} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete reminder">
                      <Button isIconOnly color="danger" variant="light" onPress={() => onDeleteReminder(reminder)}>
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Spacer for layout */}
        <Spacer y={1} />

        {/* Button to create a new reminder */}
        <Button style={{ backgroundColor: "#f26000" }} onPress={onCreateNewReminder}>
          <Plus size={18} /> Create New Reminder
        </Button>

      </ModalContent>

      <ModalFooter>
        <Button onPress={onClose} color="secondary">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
