import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import axios from "axios";

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
            setImagePreview(organizationObj.card_photo);
        }
    }, [organizationObj]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "card_photo" && files.length) {
            const file = files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_upload_preset");

            axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData)
                .then((response) => {
                    const imageUrl = response.data.secure_url;
                    setEditedOrganization((prev) => ({ ...prev, card_photo: imageUrl }));
                    setImagePreview(imageUrl);
                })
                .catch((error) => console.error("Error uploading image:", error));
        } else {
            setEditedOrganization((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        await updateOrganization(organizationId, editedOrganization);
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
                                    name="card_photo"
                                    onChange={handleChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: "200px", height: "auto" }}
                                    />
                                )}
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
