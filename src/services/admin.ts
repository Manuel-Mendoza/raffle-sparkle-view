import { api } from "@/lib/api";

export interface CustomerTicket {
  customerId: string;
  customerName: string;
  customerPhone: string;
  raffleTitle: string;
  paymentMethod: string;
  paymentProof: string;
  createdAt: string;
  tickets: Array<{
    ticketId: string;
    ticketNumber: string;
  }>;
}

export interface PendingTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  paymentProof: string;
  quantity: number;
  total: number;
  raffleTitle: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export const adminService = {
  async getPendingTickets(): Promise<CustomerTicket[]> {
    console.log('Making API call to /admin/tickets/pending');
    const response = await api.get<{ customers: CustomerTicket[] }>("/admin/tickets/pending");
    console.log('API response:', response.data);
    return response.data.customers;
  },

  async getApprovedTickets(): Promise<CustomerTicket[]> {
    const response = await api.get<{ customers: CustomerTicket[] }>("/admin/tickets/approved");
    return response.data.customers;
  },

  async approveTicket(customerId: string): Promise<void> {
    await api.put(`/admin/customers/${customerId}/approve`);
  },

  async rejectTicket(customerId: string): Promise<void> {
    await api.put(`/admin/customers/${customerId}/reject`);
  },
};
