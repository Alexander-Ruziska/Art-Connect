import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";
import UploadOrgProfileWidget from "../UploadOrgProfileWidget/UploadOrgProfileWidget";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import "./OrganizationPage.css";
import { FaArchive, FaTrashRestoreAlt } from "react-icons/fa";
import linkedInPhoto from '/images/InBug-Black.png';
import facebookPhoto from '/images/facebook-icon-black-cbf5.png';
import instaPhoto from '/images/Instagram_Glyph_Black.png';

function OrganizationPage() {
  const { organizationId } = useParams();
  const organizationObj = useStore((state) => state.organizationObj);
  const fetchOrganization = useStore((state) => state.fetchOrganization);
  const updateOrganization = useStore((state) => state.updateOrganization);

  const [isEditing, setIsEditing] = useState(false);
  const [editedOrganization, setEditedOrganization] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchOrganization(organizationId);
  }, [organizationId]);

  useEffect(() => {
    if (organizationObj) {
      setEditedOrganization(organizationObj);
    }
  }, [organizationObj]);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dk6cndcmh",
    },
  });

  const myImage = cld.image("docs/result.info.public_id");
  myImage.resize(fill().width(150).height(150));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const myNewOrg = { ...editedOrganization, profile_pic: imagePreview };
    updateOrganization(organizationId, myNewOrg);
    setIsEditing(false);
  };

  return (
    <Container id="organizationPage" className="mt-4">
      {organizationObj && (
        <Card>
          <Card.Header>
            <h2>{organizationObj.name}</h2>
          </Card.Header>
          <Card.Body>
            {isEditing ? (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedOrganization.name || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={editedOrganization.description || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mission Statement</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="mission_statement"
                    value={editedOrganization.mission_statement || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <UploadOrgProfileWidget setImagePreview={setImagePreview} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="text"
                    name="linkedin"
                    value={editedOrganization.linkedin || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    name="facebook"
                    value={editedOrganization.facebook || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="insta"
                    value={editedOrganization.insta || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    value={editedOrganization.website || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={editedOrganization.bio || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editedOrganization.phone || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  variant="light"
                  onClick={handleSave}
                  style={{
                    borderRadius: "3px",
                    border: "1px solid black",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="light"
                  onClick={() => setIsEditing(false)}
                  className="ms-2"
                  style={{
                    borderRadius: "3px",
                    border: "1px solid black",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <>
                {organizationObj.profile_pic && (
                  <img
                    src={organizationObj.profile_pic}
                    alt={`${organizationObj.name} profile`}
                    className="rounded-3"
                    style={{ width: "200px", height: "auto" }}
                  />
                )}

                <p>{organizationObj.description}</p>
                <p>{organizationObj.mission_statement}</p>

                <p><strong>Bio:</strong> {organizationObj.bio}</p>
                <p><strong>Phone number:</strong> {organizationObj.phone}</p>
                {(organizationObj.website || organizationObj.linkedin || organizationObj.facebook || organizationObj.insta) && (
              <div>
              <h5>Links:</h5>
              </div>
                )}
                {organizationObj.website && (
                <div>
                <p>Website:</p>
              <a href={organizationObj.website} target="_blank" rel="noopener noreferrer">{organizationObj.website}</a>
              </div>
              )}
                {organizationObj.linkedin && (
                 <div id="linkImg">
                  <a href={organizationObj.linkedin} target="_blank" rel="noopener noreferrer"><img id="linkImg" src={linkedInPhoto}/></a>
                  </div>
              )}
              {organizationObj.facebook && (
                <div id="linkImg">
                <a href={organizationObj.facebook} target="_blank" rel="noopener noreferrer"> <img id="linkImg" src={facebookPhoto}/></a>
                </div>
              )}
              {organizationObj.insta && (
                <div id="linkImg">
                <a href={organizationObj.insta} target="_blank" rel="noopener noreferrer"> <img id="linkImg" src={instaPhoto}/></a>
                </div>
              )}


                {organizationObj?.is_member && (
                  <Button
                    variant="light"
                    onClick={() => setIsEditing(true)}
                    style={{
                      borderRadius: "3px",
                      border: "1px solid black",
                      backgroundColor: "#e0e0e0",
                    }}
                    className="ms-2"
                  >
                    Edit profile
                  </Button>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default OrganizationPage;
