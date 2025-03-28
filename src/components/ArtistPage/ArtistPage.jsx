import React from "react"
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
// add this once the idea page has been completed
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ArtistPage() {
    const artistInfo = useStore((state) => state.artistInfo);
    const fetchArtist = useStore((state) => state.fetchArtist);
    const params = useParams();


    useEffect(() => {
        console.log(`Getting artist by id ${params.artistId}`);
        fetchArtist(params.artistId);
        console.log(artistInfo);
    }, [params.artistId]);


  return (
    <div id='cards'>
      <section className='artist'>

        {artistInfo?.map((artist) => {
            return (
                <div key={artist.id} id={artist.id}>
                    <h2>{artist.name}</h2>
                    {/* <img smg={artist.card_photo} /> */}
                    <h4>Recent Work</h4>
                    
                    <p>{artist.bio}</p>
                </div>
            )
        })}

      </section>
    </div>
  )
};

export default ArtistPage;
