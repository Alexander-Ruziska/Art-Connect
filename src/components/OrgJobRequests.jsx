import React, { useEffect } from "react";
import useStore from "../zustand/store";

const OrgJobRequests = () => {
  const {
    orgRequests = [],
    fetchRequestsForOrg,
    acceptRequest,
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
              <strong>{req.job_title}</strong> — Artist: {req.artist_name} — Status: {req.status}
              {req.status !== "accepted" && (
                <button onClick={() => acceptRequest(req.request_id)}>
                  Accept
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrgJobRequests;
