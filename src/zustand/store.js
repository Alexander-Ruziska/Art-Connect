import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import ArtistSlice from "./slices/artist.slice.js";


// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...ArtistSlice(...orgs)
}))


export default useStore;
