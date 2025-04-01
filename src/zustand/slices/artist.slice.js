import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;

const createArtistSlice = (set, get) => ({
  // getting all of the artist for the list
  artistList: [],
  randomArtist: null,
  fetchArtists: async () => {
    try {
      const response = await axios.get('/api/artists');
      set({ artistList: response.data });
    } catch (error) {
      console.log(`Error fetching artists list`);
    }
  },

  //creating a function to flip through featured artists for the homescreen
  getRandomArtist: () => {
    const artists = get().artistList;
    if (artists.length > 0) {
      const randomIndex = Math.floor(Math.random() * artists.length);
      set({ randomArtist: artists[randomIndex] });
    }
  },

  //getting an artist's photos by a specific id
  artistPhotos: [],

  Slice: "", //getting an artist by a specific id
  artistOBJ: null,
  fetchArtist: async (artistId) => {
    try {
      const response = await axios.get(`/api/artists/${artistId}`);
      console.log('Response.data:', response.data);
      set({ artistOBJ: response.data }); 
    } catch (error) {
      console.log('Error fetching artists info', error);
    }
  },

  //Alecia's original get request for a specific artist
  // fetchArtist: async (artistId) => {
  //     try {
  //         const response = await axios.get(`/api/artists/${artistId}`);
  //         console.log('Response.data:', response.data);
  //         set({ artistOBJ : response.data });
  //     } catch (error) {
  //         console.log('Error fetching artists info', error);
  //     }
  // },

  //Getting a specific artist's idea list
  artistIdeas: [],
  fetchArtistIdeas: async (artistId) => {
    try {
      const response = await axios.get(`/api/artists/${artistId}/ideas`);
      console.log(`Idea get response for specific artist:`, response.data);
      set({ artistIdeas: response.data });
    } catch (error) {
      console.log('Error fetching a specific artists ideas', error);
    }
  },

  // Updating an artist
  updateArtist: async (artistId, updatedData) => {
    try {
      const response = await axios.put(`/api/artists/${artistId}`, updatedData);
      set({ artistOBJ: response.data }); // Update the store with new data
      console.log("Artist updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating artist:", error);
    }
  },
});

export default createArtistSlice;
