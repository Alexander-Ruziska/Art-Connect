import React from "react"
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect } from "react";


function ArtistList() {
  const artistList = useStore((state) => state.artistList);
  const navigate = useNavigate();
  const params = useParams();
  const fetchArtist = useStore((state) => state.fetchArtist);

  useEffect(() => {
    console.log(`Getting artistList`);
    fetchArtist();
  }, [fetchArtist]);


  const handleClick= (event) => {
    const artistId = event.target.id;
    navigate(`/artists/${artistId}`);
  }



  return (
    <div>
      <section className="artists">
      
        {artistList?.map((artist) => {

          return(

            <div key={artist.artistId} id={artist.artistId}>
              <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={artist.card_photo} />
              <Card.Body>
              <Card.Title>{artist.name}</Card.Title>
              <Card.Text>{artist.headline_description}</Card.Text>
             <Button id={artist.id} onClick={handleClick} variant="primary">Go somewhere</Button>
            </Card.Body>
            </Card>
            </div>
          )
        })
        }

      </section>
    </div>
  )
};

export default ArtistList;
