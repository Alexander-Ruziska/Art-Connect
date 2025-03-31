import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import organizationSlice from './slices/organization.slice.js';
import ArtistSlice from "./slices/artist.slice.js";
import jobsSlice from "./slices/jobs.slice.js";
import jobRequestSlice from "./slices/jobRequests.slice.js";
import adminSlice from './slices/admin.slice.js';

// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...jobsSlice(...args),
  ...organizationSlice(...args),
  ...ArtistSlice(...args),
  ...jobRequestSlice(...args),
  ...adminSlice(...args)
}))

export default useStore;
