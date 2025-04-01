import React, { useEffect } from "react";
import useStore from "../zustand/store";

const ArtistJobRequests = () => {
  const {
    artistRequests = [],  
    fetchArtistRequests
  } = useStore();

  useEffect(() => {
    fetchArtistRequests();
  }, [fetchArtistRequests]);

  return (
    <div>
      <h2>My Job Requests</h2>
      {artistRequests.length === 0 ? (
        <p>No job requests yet.</p>
      ) : (
        <ul>
          {artistRequests.map((req) => (
            <li key={req.request_id}>
              <strong>{req.job_title}</strong> – Status: {req.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArtistJobRequests;
