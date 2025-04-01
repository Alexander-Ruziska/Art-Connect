
import axios from 'axios';


const jobRequestSlice = (set, get) => ({
  expressInterest: async (job_id) => {
    try {
      await axios.post('/api/job_requests', { job_id });
      get().fetchArtistRequests(); // <- Refresh the list
      alert('Interest submitted successfully!');
    } catch (err) {
      console.error('Error expressing interest:', err);
      alert('You must be logged in as an artist to express interest.');
    }
  },

  // Fetch job requests for artist
  fetchArtistRequests: async () => {
    try {
      const res = await axios.get('/api/job_requests/artist');
      set({ artistRequests: res.data });
    } catch (err) {
      console.error('Error fetching artist job requests:', err);
    }
  },

  fetchRequestsForOrg: async () => {
    try {
      const res = await axios.get('/api/job_requests/organization');
      set({ orgRequests: res.data });
    } catch (err) {
      console.error('Error fetching org requests:', err);
    }
  },

  acceptRequest: async (requestId) => {
    try {
      await axios.put(`/api/job_requests/${requestId}/accept`);
      alert('Request accepted!');
      get().fetchRequestsForOrg(); // Refresh
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  },
  rejectRequest: async (requestId) => {
    try {
      await axios.put(`/api/job_requests/${requestId}/reject`);
      alert('Request rejected!');
      get().fetchRequestsForOrg(); // Refresh the list
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  },  
  
  withdrawInterest: async (job_id) => {
    try {
      await axios.delete('/api/job_requests', { data: { job_id } });
      get().fetchArtistRequests(); // <- Refresh the list
      alert('Interest withdrawn.');
    } catch (err) {
      console.error('Error withdrawing interest:', err);
      alert('Could not withdraw interest.');
    }
  }
  
});


export default jobRequestSlice;