// components/DeleteConfirmModal.tsx
import React from 'react';
import { Modal, Button } from '@nextui-org/react';
import { ModalContent } from "@nextui-org/react";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string | undefined;
  itemType: 'customer' | 'service' | 'reminder';
}

export default function DeleteConfirmModal({ visible, onClose, onConfirm, itemName, itemType }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalContent>
        <div style={{ padding: '20px' }}>
          <h2>Confirm Delete</h2>
          <p style={{ margin: 6 }}>Are you sure you want to delete {itemType} {itemName}?</p>
          <Button  onPress={onConfirm} style={{ marginRight: 6, backgroundColor: "#F20000FF", color: "#FFFFFFFF" }}>Delete</Button>
          <Button onPress={onClose}>Cancel</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}