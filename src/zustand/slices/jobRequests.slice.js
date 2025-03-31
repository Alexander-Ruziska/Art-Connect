
import axios from 'axios';

const jobRequestSlice = (set, get) => ({
  // Only one purpose: submit a job request
  expressInterest: async (job_id) => {
    try {
      await axios.post('/api/job_requests', { job_id });
      alert('Interest submitted successfully!');
    } catch (err) {
      console.error('Error expressing interest:', err);
      alert('You must be logged in as an artist to express interest.');
    }
  }
});

export default jobRequestSlice;
