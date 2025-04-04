import React, { useEffect } from "react";
import useStore from "../zustand/store";
import { Badge } from "react-bootstrap";


const statusIcons = {
  accepted: "✅",
  rejected: "❌",
  pending: "⏳",
};

const statusVariants = {
  accepted: "success",
  rejected: "danger",
  pending: "warning",
};



const ArtistJobRequests = () => {
  const {
    artistRequests = [],  
    fetchArtistRequests
  } = useStore();

  useEffect(() => {
    fetchArtistRequests();
  }, [fetchArtistRequests]);

  return (
    <div className="mt-4">
      <h2>My Jobs</h2>
      {artistRequests.length === 0 ? (
        <p>No job requests yet.</p>
      ) : (
        <ul className="list-group">
          {artistRequests.map((req) => (
            <li key={req.request_id} className="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>{req.job_title}</strong></div>
              <Badge bg={statusVariants[req.status]}>
                {statusIcons[req.status]} {req.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArtistJobRequests;