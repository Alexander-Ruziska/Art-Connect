import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { Badge } from "react-bootstrap";
import './ArtistJobRequests.css'; // ✅ New CSS

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
    fetchArtistRequests,
  } = useStore();

  useEffect(() => {
    fetchArtistRequests();
  }, [fetchArtistRequests]);

  return (
    <div id="homePage" className="container text-center">
      <div className="card mx-auto border-0">
        <div className="card-body">
          <h1 className="mb-4">🎨 My Job Requests</h1>

          {artistRequests.length === 0 ? (
            <p className="text-muted">No job requests yet.</p>
          ) : (
            <ul className="list-group text-start">
              {artistRequests.map((req) => (
                <li
                  key={req.request_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div><strong>{req.job_title}</strong></div>
                  <Badge bg={statusVariants[req.status]}>
                    {statusIcons[req.status]} {req.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistJobRequests;
