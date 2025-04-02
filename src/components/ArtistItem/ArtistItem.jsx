import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const ArtistItem = ({ artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artists/${artist.id}`);
  };

  return (
    <Card className="artist-card h-100">
      <Card.Img
        variant="top"
        src={artist.card_photo}
        className="card-img-top"
        alt={`Image of ${artist.name}`}
      />
      <Card.Body>
        <Card.Title>{artist.name}</Card.Title>
        <Card.Text>{artist.headline_description}</Card.Text>
        <Button
          variant="primary"
          onClick={handleClick}
          className="w-100"
        >
          Go to artist profile
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ArtistItem;
