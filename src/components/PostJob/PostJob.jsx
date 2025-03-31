import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';

const PostJob = () => {
  const { createJob, user } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [archived, setArchived] = useState(false);

  if (!user?.is_organization) {
    return <p>You must be an organization to post jobs.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob({
        title,
        description,
        deadline,
        organization_id: user.organization_id,
        archived,
      });

      alert('Job posted successfully!');
      navigate('/jobList'); 
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
          checked={archived}
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
