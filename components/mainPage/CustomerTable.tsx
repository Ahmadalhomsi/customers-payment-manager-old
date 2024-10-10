// components/CustomerTable.tsx
import React from 'react';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Spinner,
} from '@nextui-org/react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Customer } from '../mainPage/types';
import { SortConfig, sortData } from '../../utils/sortUtils';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  sortConfig: SortConfig<Customer> | null;
  setSortConfig: (config: SortConfig<Customer> | null) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onAddService: (customer: Customer) => void;
  onViewServices: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  loading,
  sortConfig,
  setSortConfig,
  onEdit,
  onDelete,
  onAddService,
  onViewServices,
}: CustomerTableProps) {
  const handleSort = (key: keyof Customer) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = sortConfig ? sortData(customers, sortConfig) : customers;

  const handleRowAction = (rowId: string) => {
    const customer = customers.find((c) => c.id === rowId);
    if (customer) {  
      onViewServices(customer);
    }

  };

  return (
    <Table
      aria-label="Customers Table"
      selectionMode="multiple"
      color="warning"
      onRowAction={(row : any) => handleRowAction(row)}
    >
      <TableHeader>
        <TableColumn onClick={() => handleSort('name')}>
          Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableColumn>
        <TableColumn onClick={() => handleSort('email')}>
          Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableColumn>
        <TableColumn onClick={() => handleSort('phone')}>
          Phone {sortConfig?.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody loadingContent={<Spinner label="Loading..." color="current" />} isLoading={loading}>
        {sortedCustomers.map((customer: Customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Tooltip content="Edit customer">
                  <Button isIconOnly color="primary" variant="light" onPress={() => onEdit(customer)}>
                    <Edit size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete customer">
                  <Button isIconOnly color="danger" variant="light" onPress={() => onDelete(customer)}>
                    <Trash2 size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="Add service">
                  <Button isIconOnly color="success" variant="light" onPress={() => onAddService(customer)}>
                    <Plus size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="View services">
                  <Button isIconOnly color="secondary" variant="light" onPress={() => onViewServices(customer)}>
                    <Eye size={18} />
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
