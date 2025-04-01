import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Component for displaying an individual artist's card
const ArtistItem = ({ artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artists/${artist.id}`);
  };

  return (
    <div key={artist.artistId} id={artist.artistId}>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={artist.card_photo} />
        <Card.Body>
          <Card.Title>{artist.name}</Card.Title>
          <Card.Text>{artist.headline_description}</Card.Text>
          <Button id={artist.id} onClick={handleClick} variant="primary">
            Go to artist profile
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistItem;
