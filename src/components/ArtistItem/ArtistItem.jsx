import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import useStore from "../../zustand/store";

const ArtistItem = ({ artist }) => {
  const artistOBJ = useStore((state) => state.artistOBJ);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artists/${artist.id}`);
  };

  return (
    <Card className="artist-card mb-3">
      {artist.soundcloud_id ? (
        <iframe
          width="100%"
          height="220" // Set a fixed height for the iframe (same as image height)
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${artist.soundcloud_id}`}
          frameBorder="0"
          allowFullScreen
          title="SoundCloud Player"
          style={{ objectFit: "cover" }} // Ensures the iframe fits the container like the image
        ></iframe>
      ) : (
        <Card.Img
          variant="top"
          src={artist.card_photo}
          className="card-img-top"
          alt={`Image of ${artist.name}`}
        />
      )}
      <Card.Body>
        <Card.Title>{artist.name}</Card.Title>
        <Card.Text>{artist.headline_description}</Card.Text>
      </Card.Body>

      {/* Button container, always at the bottom */}
      <Card.Footer>
      <Button
          variant="light"
          onClick={handleClick}
          style={{
          borderRadius: "3px",
          border: "1px solid black",
          backgroundColor: "#e0e0e0",
          padding: "6px 12px",
          fontSize: "1rem",
          display: "block",  // Makes the button a block element
          margin: "0 auto",  // Centers it horizontally
        }}
        >
          Go to artist profile
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ArtistItem;
