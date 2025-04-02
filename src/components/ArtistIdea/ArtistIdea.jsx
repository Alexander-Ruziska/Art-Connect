import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import moment from "moment";
import Card from "react-bootstrap/Card";
import "./ArtistIdea.css"; 

function ArtistIdea() {
  const artistIdeas = useStore((state) => state.artistIdeas);
  const params = useParams();
  const fetchArtistIdeas = useStore((state) => state.fetchArtistIdeas);

  useEffect(() => {
    console.log(`Getting artist by id on the ideas page ${params.artistId}`);
    fetchArtistIdeas(params.artistId);
  }, [params.artistId]);

  useEffect(() => {
    console.log('updated artistIdeas array:', artistIdeas);
  }, [artistIdeas]);

  return (
    <div>
      <section>
        {artistIdeas?.map((idea) => {
          return(
            <div key={idea.id} id={idea.id}>
              <Card className="mb-3">
                <Card.Header>{idea.title}</Card.Header>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p><b>Idea:</b> {idea.idea}</p>
                    <footer className="blockquote-footer"><b>Created on:</b>{moment(idea.created_at).format("MMM Do YYYY")}</footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </div>
          )
        })}
      </section>
    </div>
  )
};

export default ArtistIdea;
