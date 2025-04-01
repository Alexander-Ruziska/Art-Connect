import React, { useEffect } from "react";
import useStore from "../zustand/store";

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
    <div>
      <h2>Job Requests</h2>
      {orgRequests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul>
          {orgRequests.map((req) => (
            <li key={req.request_id}>
              <strong>{req.job_title}</strong> — Artist: {req.artist_name} — Status: <em>{req.status}</em>

              {/* Show Accept/Reject buttons only if not already accepted or rejected */}
              {req.status !== "accepted" && req.status !== "rejected" && (
                <>
                  <button onClick={() => acceptRequest(req.request_id)}>Accept</button>
                  <button onClick={() => rejectRequest(req.request_id)} style={{ marginLeft: '10px' }}>Reject</button>
                </>
              )}

              {req.status === "accepted" && <span style={{ color: "green", marginLeft: "10px" }}>✓ Accepted</span>}
              {req.status === "rejected" && <span style={{ color: "red", marginLeft: "10px" }}>✕ Rejected</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrgJobRequests;
