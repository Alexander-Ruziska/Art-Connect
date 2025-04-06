import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;

const createIdeaSlice
 = (set, get) => ({

  
    allArtistIdeas: [],



    //POST an artist's idea
    addIdea: async (newIdea) => {
        //newIdea: {artist_id, title, newIdea}
        console.log('newIdea', newIdea);
        try {
                await axios.post(`/api/ideas`, newIdea);
                //wil need to update the artist idea list after this
                //get().fetchAllArtistIdeas();
        } catch (err) {
                console.error('Slice issue post the idea', err);
        }
    },


    //archive ideas
    archiveIdeaFun: async (ideaId, artistId) => {
        try {
                await axios.put(`/api/ideas/archive`, { id: ideaId });
                console.log('ideaID', ideaId);
                //refreshing the list of artist ideas
                get().fetchArtistIdeas(artistId);
        } catch (error) {
                console.error(`error archiving idea`, error);
        }
    }

});

export default createIdeaSlice;