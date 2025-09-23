import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface EmailPreference {
  receiveEmails: boolean;
}

export const emailPreferenceService = {
  async getEmailPreference(): Promise<EmailPreference> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/email-preference`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateEmailPreference(receiveEmails: boolean): Promise<EmailPreference> {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/admin/email-preference`, 
      { receiveEmails },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
