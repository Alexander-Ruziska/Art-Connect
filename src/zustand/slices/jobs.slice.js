import {create} from 'zustand';
import axios from 'axios';


const useJobsStore = create((set, get) => ({
  jobs: [],
  // Fetch all jobs
  fetchJobs: async () => {
    try {
      const res = await axios.get('/api/jobs');
      set({ jobs: res.data });
    } catch (err) {
      console.error('fetchJobs error:', err);
    }
  },

  // Fetch job by ID
  fetchJobById: async (id) => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      console.log('Fetched job:', res.data);
    } catch (err) {
      console.error('fetchJobById error:', err);
    }
  },
  
}))




export default useJobsStore;