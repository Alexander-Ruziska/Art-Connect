import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import axios from "axios";
import UploadOrgProfileWidget from "../UploadOrgProfileWidget/UploadOrgProfileWidget";
import { Cloudinary } from "@cloudinary/url-gen/index";
// import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import UploadWidget from "../UploadGalleryWidget/UploadGalleryWidget";
import { image } from "@cloudinary/url-gen/qualifiers/source";

function OrganizationPage() {
  const { organizationId } = useParams();
  const organizationObj = useStore((state) => state.organizationObj);
  const fetchOrganization = useStore((state) => state.fetchOrganization);
  const updateOrganization = useStore((state) => state.updateOrganization);
  const user = useStore((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedOrganization, setEditedOrganization] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchOrganization(organizationId);
  }, [organizationId]);

  useEffect(() => {
    if (organizationObj) {
      setEditedOrganization(organizationObj);
      // setImagePreview(organizationObj.profile_pic);
    }
  }, [organizationObj]);

  //----CLOUDINARY INFO----//

    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'dwqjkxlqe'

      }
    });

      // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
  const myImage = cld.image('docs/result.info.public_id'); 

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(150).height(150));  

//----------------------//

  const handleChange = (e) => {
    const { name, value } = e.target;
      setEditedOrganization((prev) => ({ ...prev, [name]: value }));
    };

  const handleSave = () => {
    const myNewOrg = {...editedOrganization, profile_pic: imagePreview}
    console.log(myNewOrg);
     updateOrganization(organizationId, myNewOrg);
    setIsEditing(false);
  };

  const isOrgMember = organizationObj?.is_member;

  return (
    <div id="cards">
      <section className="organization">
        {organizationObj && (
          <div key={organizationObj.id} id={organizationObj.id}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedOrganization.name || ""}
                  onChange={handleChange}
                  placeholder="Organization Name"
                />
                <textarea
                  name="description"
                  value={editedOrganization.description || ""}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <textarea
                  name="mission_statement"
                  value={editedOrganization.mission_statement || ""}
                  onChange={handleChange}
                  placeholder="Mission Statement"
                />
                <input
                  type="file"
                  name="profile_pic"
                  onChange={handleChange}
                />
                {isEditing &&(<UploadOrgProfileWidget setImagePreview={setImagePreview}/>)}
                {editedOrganization.profile_pic && (
                  <img
                    src={editedOrganization.profile_pic}
                    alt="Preview"
                    style={{ width: "200px", height: "auto" }}
                  />
                )}

                {/* Editable user fields */}
                <input
                  type="text"
                  name="linkedin"
                  value={editedOrganization.linkedin || ""}
                  onChange={handleChange}
                  placeholder="LinkedIn"
                />
                <input
                  type="text"
                  name="facebook"
                  value={editedOrganization.facebook || ""}
                  onChange={handleChange}
                  placeholder="Facebook"
                />
                <input
                  type="text"
                  name="insta"
                  value={editedOrganization.insta || ""}
                  onChange={handleChange}
                  placeholder="Instagram"
                />
                <input
                  type="text"
                  name="website"
                  value={editedOrganization.website || ""}
                  onChange={handleChange}
                  placeholder="Website"
                />
                <textarea
                  name="bio"
                  value={editedOrganization.bio || ""}
                  onChange={handleChange}
                  placeholder="Bio"
                />
                <input
                  type="text"
                  name="phone"
                  value={editedOrganization.phone || ""}
                  onChange={handleChange}
                  placeholder="Phone"
                />

                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{organizationObj.name}</h2>
                {organizationObj.profile_pic && (
                  <img
                    src={organizationObj.profile_pic}
                    alt={`${organizationObj.name} profile`}
                    style={{ width: "200px", height: "auto", borderRadius: "8px" }}
                  />
                )}
                <h4>Recent Work</h4>
                <p>{organizationObj.description}</p>
                <p>{organizationObj.mission_statement}</p>

                {/* Display additional user info */}
                <p><strong>Bio:</strong> {organizationObj.bio}</p>
                <p><strong>LinkedIn:</strong> {organizationObj.linkedin}</p>
                <p><strong>Facebook:</strong> {organizationObj.facebook}</p>
                <p><strong>Instagram:</strong> {organizationObj.insta}</p>
                <p><strong>Website:</strong> {organizationObj.website}</p>
                <p><strong>Phone:</strong> {organizationObj.phone}</p>

                {organizationObj?.is_member && (
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default OrganizationPage;
