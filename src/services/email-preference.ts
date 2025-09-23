import { api } from "@/lib/api";

export interface EmailPreference {
  receiveEmails: boolean;
}

export const emailPreferenceService = {
  async getEmailPreference(): Promise<EmailPreference> {
    const token = localStorage.getItem('token');
    const response = await api.get(`/admin/email-preference`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateEmailPreference(receiveEmails: boolean): Promise<EmailPreference> {
    const token = localStorage.getItem('token');
    const response = await api.put(`/admin/email-preference`,
      { receiveEmails },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
