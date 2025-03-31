import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../zustand/store"; 
import { useNavigate } from 'react-router-dom';
import "./OrganizationItem.css"; 

const OrganizationItem = ({ organization }) => {
  
  
//navigate to post-job page
  const navigate = useNavigate();

  //function to navigate to post-job page

  const handlePostJob = () => {   
    console.log('organization', organization);
    navigate(`/post-job/${organization.id}`);
  }
  

  return (
    
  <div className="organization-card">
    
    <h3>{organization.name}</h3>
    <h3>{organization.description}</h3>
    <h3>{organization.mission_statement}</h3>
    <button onClick={handlePostJob}>Post Job</button>
  </div>

  );
};

export default OrganizationItem;
