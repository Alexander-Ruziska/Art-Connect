import React, { useEffect } from 'react';
import useStore from "../../zustand/store";
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const { randomArtist, fetchArtists, getRandomArtist } = useStore();
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadArtists() {
            await fetchArtists();
            getRandomArtist();  // Pick a random artist after fetching
        }
        loadArtists();
    }, [fetchArtists, getRandomArtist]);

    if (!randomArtist) {
        return <div>Loading...</div>;
    }

    const newIdeaNav= () => {
        navigate(`/ideas`);
    }

    return (
        <div>
            <div id='featuredArtist'>
            <h2>{randomArtist.name}</h2>
            <p>{randomArtist.headline_description}</p>
            <p>Soundcloud ID: {randomArtist.soundcloud_id}</p>
            </div>
            <div>
            {user.artist_id && <button onClick={newIdeaNav}>Post new idea</button>}
            </div>
        </div>
    );
}

export default HomePage;
