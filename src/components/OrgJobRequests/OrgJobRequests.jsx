import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { Badge, Button } from "react-bootstrap";
import './OrgJobRequests.css';

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

const OrgJobRequests = () => {
  const {
    orgRequests = [],
    fetchRequestsForOrg,
    acceptRequest,
    rejectRequest
  } = useStore();

  useEffect(() => {
    fetchRequestsForOrg();
  }, [fetchRequestsForOrg]);

  return (
    <div id="homePage" className="container text-center">
      <h1 className="mb-4">📥 Manage Requests</h1>

      {orgRequests.length === 0 ? (
        <p className="text-muted">No requests yet.</p>
      ) : (
        <ul className="list-group text-start">
          {orgRequests.map((req) => (
            <li
              key={req.request_id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{req.job_title}</strong> — Artist: {req.artist_name}
              </div>

              <div className="text-end">
                <Badge bg={statusVariants[req.status]} className="me-2">
                  {statusIcons[req.status]} {req.status}
                </Badge>

                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => acceptRequest(req.request_id)}
                      className="me-2"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => rejectRequest(req.request_id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrgJobRequests;
