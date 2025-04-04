import React, { useEffect } from 'react';
import useStore from "../../zustand/store";
import './HomePage.css';

function HomePage() {
    const { randomArtist, fetchArtists, getRandomArtist } = useStore();

    useEffect(() => {
        async function loadArtists() {
            await fetchArtists();
            getRandomArtist();
        }
        loadArtists();
    }, [fetchArtists, getRandomArtist]);

    if (!randomArtist) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div id="homePage" className="container text-center">
            <h1 className="mb-4">Featured Artist</h1>
            <div className="card mx-auto border-0">
                <div className="card-body">
                    <img
                        src={randomArtist.card_photo}
                        alt="Artist"
                        className="img-fluid"
                    />
                    <h2 className="mt-4">{randomArtist.name}</h2>
                    <p className="mt-3">{randomArtist.headline_description}</p>
                    <p className="text-muted">Soundcloud ID: {randomArtist.soundcloud_id}</p>
                    <p>A creative hub for artists, organizations, and community connection.
This platform is built to spark collaboration between local artists and organizations in the FM area and beyond. Artists can showcase their work, express new ideas, and find meaningful, paid opportunities. Organizations can share their mission, post creative projects, and connect with artists to bring those ideas to life.
Whether you're an artist looking for your next project, an organization ready to make an impact through art, or a community member wanting to support creative work—you belong here.
Together, we’re weaving a tapestry of creativity, connection, and shared purpose.</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
