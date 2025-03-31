import React from "react"
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const { jobs, expressInterest } = useStore();
  const user = useStore((state) => state.user);


  return (
    <div>
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <div>
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Deadline: {job.deadline}</p>
            </li>
            <div>
              {user.artist_id &&
           <button onClick={() => expressInterest(job.id)}>I'm Interested</button>}
           </div>
           </div>

          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
