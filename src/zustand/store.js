import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import organizationSlice from './slices/organization.slice.js';
import ArtistSlice from "./slices/artist.slice.js";


// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...jobsSlice(...args),
  ...organizationSlice(...args),
  ...ArtistSlice(...args)
}))

export default useStore;
