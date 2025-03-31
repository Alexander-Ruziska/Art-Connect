// JobInterestList.js
import React from 'react';
import useStore from '../../zustand/store';

const JobInterestList = () => {
  const { jobs, expressInterest } = useStore();

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Deadline: {job.deadline}</p>
              <button onClick={() => expressInterest(job.id)}>I'm Interested</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobInterestList;
