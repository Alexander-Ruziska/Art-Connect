
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

import React from "react";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./OrganizationItem.css";

const OrganizationItem = ({ organization }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organization-list/${organization.id}`);
  };

  return (
    <Card className="organization-card" style={{ width: '18rem' }}>
      {organization.profile_pic && (
        <Card.Img variant="top" src={organization.profile_pic} alt={`${organization.name} logo`} />
      )}
      <Card.Body>
        <Card.Title>{organization.name}</Card.Title>
        <Card.Text>{organization.description}</Card.Text>
        <Card.Text>{organization.mission_statement}</Card.Text>
        <Button variant="primary" onClick={handleClick}>
          Go to organization profile
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OrganizationItem;
