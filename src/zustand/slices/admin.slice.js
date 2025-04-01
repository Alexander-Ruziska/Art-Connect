import axios from 'axios';

const createAdminSlice = (set) => ({
  adminUsers: [],

  fetchAdminUsers: async () => {
    try {
      const response = await axios.get('/api/admin/users');
      set({ adminUsers: response.data });
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  },

  banUser: async (userId) => {
    try {
      await axios.put(`/api/admin/ban/${userId}`);
    } catch (error) {
      console.error("Error banning user:", error);
    }
  },
  

  unbanUser: async (userId) => {
    try {
      await axios.put(`/api/admin/unban/${userId}`);
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  }
  

});

export default createAdminSlice;
