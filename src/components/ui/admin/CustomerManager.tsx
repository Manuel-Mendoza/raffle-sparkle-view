import { useState, useEffect } from "react";
import { adminService, CustomerTicket } from "@/services/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/base/table";

export const CustomerManager = () => {
  const [customers, setCustomers] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await adminService.getApprovedTickets();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-4">Clientes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Método de pago</TableHead>
            <TableHead>Tickets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId}>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell>{customer.customerPhone}</TableCell>
              <TableCell>{customer.paymentMethod}</TableCell>
              <TableCell>{customer.tickets.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
