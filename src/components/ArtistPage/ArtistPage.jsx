import React from "react"
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
// add this once the idea page has been completed
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ArtistPage() {
    const artistOBJ = useStore((state) => state.artistOBJ);
    const fetchArtist = useStore((state) => state.fetchArtist);
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        console.log(`Getting artist by id ${params.artistId}`);
        fetchArtist(params.artistId);

    }, [params.artistId]);

    // useEffect(() => {
    //     console.log('updated artistobj:', artistOBJ);
    // }, [artistOBJ]);

    const ideaButton= (event) => {
        const artistId = event.target.id;
        navigate(`/artists/${artistId}/ideas`);
    }

  return (
    
      artistOBJ ? (
        <div id='artistPage'>
          <h1>{artistOBJ.name}</h1>
          <p>{artistOBJ.headline_description}</p>
          <img smg={artistOBJ.card_photo} />
          <h4>Projects</h4>
          {/* Code for soundcloud */}
          <div>
            {artistOBJ.soundcloud_id &&
                <iframe width="100%" height="166" sallow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${user.soundcloud_id}&amp;{ ADD YOUR PARAMETERS HERE }">
        </iframe> }
          </div>
          {artistOBJ.photos && artistOBJ.photos.length > 0 && (
            <div>
              {artistOBJ.photos.map(photo => (
                <div key={photo.id}>
                  <img src={photo.image_url} alt={photo.title}/>
                  <h5>{photo.title}</h5>
                  <p>{photo.description}</p>
                </div>
              ))}
            </div>
          )}
          
          <img src={artistOBJ.profile_pic} />
          <p>{artistOBJ.bio}</p>
          <h5>Links:</h5>
          <p>{artistOBJ.website}</p>
          <p>{artistOBJ.spotify_id}</p>
          <p>{artistOBJ.linkedin}</p>
          <p>{artistOBJ.facebook}</p>
          <p>{artistOBJ.insta}</p>

          <button id={artistOBJ.id} onClick={ideaButton}>Artist Ideas</button>
          </div>
        ) : (
          <p>Loading...</p>
        )
      

  

  );
};

export default ArtistPage;
