import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../zustand/store"; 
import "./OrganizationItem.css"; 

const OrganizationItem = ({ organization }) => {
  
  

  

  return (
    
  <div className="organization-card">
    
    <h3>{organization.name}</h3>
    <h3>{organization.description}</h3>
    <h3>{organization.mission_statement}</h3>
  </div>

  );
};

export default OrganizationItem;
