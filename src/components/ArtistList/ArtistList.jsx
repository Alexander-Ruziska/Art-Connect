import React from "react"
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ArtistList() {
  const artistList = useStore((state) => state.artistList);
  const navigate = useNavigate();

  const handleClick = (event) => {
    const artistId = event.target.id;
    navigate(`/artists/${artistId}`)
    console.log(artistId);
  }


  return (
    <div>
      
      <section  className="artists">
      
        {artistList?.map((artist) => {
          return(
            <Card style={{ width: '18rem' }}>
            <div id={artist.artistId} key={artist.artistId}>
              {/* will need to go back an make a flip so if they have a song they'd like to show instead it will show that instead of the photo*/}
              <Card.Img variant="top" src={artist.card_photo} />
              <Card.Title>{artist.name}</Card.Title>
              <Card.Text>{artist.headline_description}</Card.Text>
              <Button id={artist.id} onClick={handleClick} variant="primary">Go to Profile</Button>
            </div>
            </Card>
          )
        })
        }

      </section>
     
    </div>
  )
};

export default ArtistList;
