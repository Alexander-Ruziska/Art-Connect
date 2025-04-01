import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;

const createPhotoSlice
 = (set, get) => ({
 

    addPhoto: async (newPhoto) => {
        console.log('NewPhoto:', newPhoto);
        try {
            await axios.post(`/api/photos`, newPhoto);
            //refresh everything 
            get().fetchArtists();
        } catch (error) {
            console.error('Had issues posting photos', error);
        }
    }

});

export default createPhotoSlice;