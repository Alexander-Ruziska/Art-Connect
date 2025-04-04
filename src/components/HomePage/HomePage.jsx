import React, { useEffect } from 'react';
import useStore from "../../zustand/store";

function HomePage() {
    const { randomArtist, fetchArtists, getRandomArtist } = useStore();

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




    return (
        <div>
            <div id='featuredArtist'>
            <h2>{randomArtist.name}</h2>
            {/* <img src={randomArtist.card_photo} alt="Artist photo" /> */}
            <p>{randomArtist.headline_description}</p>
            <p>Soundcloud ID: {randomArtist.soundcloud_id}</p>
            </div>


        </div>
    );
}

export default HomePage;
