import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import moment from "moment";
import Card from "react-bootstrap/Card";
import "./ArtistIdea.css"; 
import { Button } from "react-bootstrap";



function ArtistIdea() {
  const artistIdeas = useStore((state) => state.artistIdeas);
  const params = useParams();
  const fetchArtistIdeas = useStore((state) => state.fetchArtistIdeas);
  const archiveIdeaFun = useStore((state) => state.archiveIdeaFun);

  useEffect(() => {
    console.log(`Getting artist by id on the ideas page ${params.artistId}`);
    fetchArtistIdeas(params.artistId);
  }, [params.artistId]);

  useEffect(() => {
    console.log('updated artistIdeas array:', artistIdeas);
  }, [artistIdeas]);
  
  // archiveIdea((idea.id) => {
  //   archiveIdeaFun(idea.id);
  // });

  return (
    <div>
      <section>
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
                      <Button onClick={() => archiveIdeaFun(idea.id, idea.artist_id)} >Delete idea</Button>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </section>
    </div>
  );
  
};

export default ArtistIdea;
