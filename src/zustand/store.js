import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import organizationSlice from './slices/organization.slice.js';


// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...organizationSlice(...args),
}))


export default useStore;
