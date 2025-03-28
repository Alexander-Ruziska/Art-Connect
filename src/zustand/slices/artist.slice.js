import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;

const createArtistSlice
 = (set, get) => ({


// getting all of the artist for the list
artistList: [],
fetchArtists: async () => {
    try{
        const response = await
        axios.get('/api/artists');
        set({ artistList: response.data });
    } catch (error) {
        console.log(`Error fetching artists list`);
    }
},


//getting an artist by a specific id
artistInfo: [],
fetchArtist: async (artistId) => {
    try {
        const response = await axios.get(`/api/artists/${artistId}`);
        set({ artistInfo : response.data });
    } catch (error) {
        console.log('Error fetching artists info', error);
    }
},


//getting an artist's photos by a specific id
artistPhotos: [],


//creating a function to flip through featured artists for the homescreen


//

    
   

});



export default createArtistSlice
;
