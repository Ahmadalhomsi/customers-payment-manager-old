import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, ModalBody, ModalFooter, ModalHeader, SelectItem, ModalContent, DatePicker, DateValue, Spacer, Textarea } from '@nextui-org/react';
import { Reminder, ReminderStatus } from './types';
import { parseDate } from '@internationalized/date';

interface ReminderModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (reminderData: Partial<Reminder>) => void;
    selectedReminder: Reminder | null;
}

export default function ReminderModal({
    visible,
    onClose,
    onSubmit,
    selectedReminder,
}: ReminderModalProps) {
    const [scheduledAt, setScheduledAt] = useState<DateValue>(parseDate(new Date().toISOString().split('T')[0]));
    const [status, setStatus] = useState<ReminderStatus>(ReminderStatus.SCHEDULED);

    useEffect(() => {
        if (selectedReminder) {
            setScheduledAt(selectedReminder.scheduledAt);
            setStatus(selectedReminder.status);
        } else {
            setScheduledAt(parseDate(new Date().toISOString().split('T')[0]));
            setStatus(ReminderStatus.SCHEDULED);
        }
    }, [selectedReminder]);

    const handleSubmit = () => {
        onSubmit({
            scheduledAt: scheduledAt,
            status,
        });
    };

    return (
        <Modal isOpen={visible} onClose={onClose}>
            <ModalContent>
                <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: 6 }}
                    >{selectedReminder ? 'Edit Reminder' : 'Create Reminder'}</h3>
                    <DatePicker
                        label="Scheduled At"
                        value={scheduledAt}
                        onChange={setScheduledAt}
                    />
                    <Spacer y={1} />
                    <Select
                        label="Status"
                        value={status}
                        defaultSelectedKeys={[status]}
                        onChange={(e) => setStatus(e.target.value as ReminderStatus)}
                        isDisabled
                    >
                        {Object.values(ReminderStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </Select>
                    <Spacer y={1} />
                    <Textarea label="Message" placeholder="Enter message" />
                    <Spacer y={1} />

                    <Button style={{ marginRight: 6 }} onPress={handleSubmit}>
                        {selectedReminder ? 'Update' : 'Create'}
                    </Button>
                    <Button color="danger" onPress={onClose}>
                        Close
                    </Button>


                </div>
            </ModalContent>
        </Modal>
    );
};


