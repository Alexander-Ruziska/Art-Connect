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
  // Create a new job
createJob: async (newJob) => {
  try {
    const res = await axios.post('/api/jobs', newJob);
    get().fetchJobs(); // Refresh list after adding job
    return res.data; // Return the newly created jobs
  } catch (err) {
    console.error('createJob error:', err);
  }
},

  
}))




export default useJobsStore;