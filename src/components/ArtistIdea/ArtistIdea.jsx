import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import moment from "moment";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ArtistIdea.css"; // Make sure you have the corresponding CSS file

function ArtistIdea() {
  const artistIdeas = useStore((state) => state.artistIdeas);
  const params = useParams();
  const fetchArtistIdeas = useStore((state) => state.fetchArtistIdeas);
  const archiveIdeaFun = useStore((state) => state.archiveIdeaFun);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Getting artist by id on the ideas page ${params.artistId}`);
    fetchArtistIdeas(params.artistId);
  }, [params.artistId]);

  const newIdeaNav = () => {
    navigate(`/ideas`);
  };

  return (
    <div className="artist-idea-container">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Artist Ideas</h2>
        <p className="text-muted">Check out the ideas posted by the artist.</p>
      </div>
      
      {user.artist_id && (
        <div className="mb-4">
          <Button variant="success" onClick={newIdeaNav}>Post New Idea</Button>
        </div>
      )}
      
      {artistIdeas?.length === 0 ? (
        <p className="text-muted">Artist has not posted any ideas.</p>
      ) : (
        artistIdeas.map((idea) => (
          <div key={idea.id} id={idea.id}>
            <Card className="mb-3">
              <Card.Header>{idea.title}</Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p><b>Idea:</b> {idea.idea}</p>
                  <footer className="blockquote-footer">
                    <b>Created on:</b> {moment(idea.created_at).format("MMM Do YYYY")}
                    <Button variant="light" onClick={() => archiveIdeaFun(idea.id, idea.artist_id)} className="ms-2" style={{ borderRadius: "3px", border: "1px solid black", backgroundColor: "#e0e0e0", padding: "6px 12px", fontSize: "1rem" }}>
                      Delete Idea
                    </Button>
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}

export default ArtistIdea;
