import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const {
    jobs,
    expressInterest,
    withdrawInterest,
    fetchArtistRequests,
    artistRequests = [],
    user
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.artist_id) {
      fetchArtistRequests();
    }
  }, [fetchArtistRequests, user.artist_id]);


console.log('user', user)
return (
  <div>
    <h2>Job Listings</h2>

    {jobs.length === 0 ? (
      <p>No jobs available.</p>
    ) : (
      <ul>
        {jobs.map((job) => {
          const hasRequested = artistRequests.some(
            (req) => req.job_id === job.id
          );

          return (
            <li key={job.id} className="mb-3 border p-3 rounded">
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>

              {user.artist_id && (
                <button
                  className={`btn btn-sm ${hasRequested ? "btn-outline-danger" : "btn-primary"}`}
                  onClick={() =>
                    hasRequested
                      ? withdrawInterest(job.id)
                      : expressInterest(job.id)
                  }
                >
                  {hasRequested ? "Withdraw Interest" : "I'm Interested"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);
};

export default JobList;
