import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;


const createOrganizationSlice = (set, get) => ({
    organizations: [],
    orgImage: {},
    fetchOrganizations: async () => {
        try {
          const response = await axios.get("/api/organizations");
          set({ organizations: response.data });
        } catch (error) {
          console.error("Error Organizations:", error);
        }
      },

})


export default createOrganizationSlice;
