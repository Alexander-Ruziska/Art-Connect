import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import useStore from '../../zustand/store';

const PostJob = () => {
  const { createJob, user } = useStore();
  const navigate = useNavigate();
  const orgId = useParams().id; 
  console.log('orgId', orgId)
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [is_archived, setArchived] = useState(false);

  if (!user?.is_organization) {
    return <p>You must be an organization to post jobs.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating job:', { title, orgId, description, deadline, is_archived });
    try {
      await createJob({
        
        organization_id: user.organization_id, 

        title,
        description,
        deadline,
        is_archived,
      });
  
      alert('Job posted successfully!');
      navigate('/job-list');
    } catch (err) {
      console.error('Job creation failed:', err);
      alert('There was an error posting the job.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Job</h2>

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <br />

      <label>Deadline:</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <br />

      <label>
        <input
          type="checkbox"
          checked={is_archived}
          onChange={(e) => setArchived(e.target.checked)}
        />
        Archived
      </label>
      <br />

      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJob;
