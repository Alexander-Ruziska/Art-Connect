import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./OrganizationItem.css"; // Make sure you import the corresponding CSS

const OrganizationItem = ({ organization }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organization-list/${organization.id}`);
  };

  return (
    <Card id="organizationItem" className="mb-3">
      {organization.profile_pic && (
        <Card.Img 
          variant="top" 
          src={organization.profile_pic} 
          alt={`${organization.name} logo`} 
          style={{ objectFit: "cover" }} // Ensures the image fits within the set size
        />
      )}
      <Card.Body>
        <Card.Title>{organization.name}</Card.Title>
        <Card.Text>{organization.description}</Card.Text>
      </Card.Body>

      {/* Button container, always at the bottom */}
      <Card.Footer>
        <Button 
          variant="light" 
          onClick={handleClick} 
          style={{ borderRadius: "3px", border: "1px solid black", backgroundColor: "#e0e0e0", padding: "6px 12px", fontSize: "1rem" }}
        >
          Go to organization profile
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default OrganizationItem;
