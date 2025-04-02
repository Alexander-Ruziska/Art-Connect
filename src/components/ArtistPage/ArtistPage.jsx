import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams, useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen/index";
// import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import UploadWidget from "../UploadGalleryWidget/UploadGalleryWidget";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./ArtistPage.css";
import UploadArtistProfileWidget from "../UploadArtistProfileWidget/UploadArtistProfileWidget";

function ArtistPage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const artistOBJ = useStore((state) => state.artistOBJ);
  const fetchArtist = useStore((state) => state.fetchArtist);
  const updateArtist = useStore((state) => state.updateArtist);
  const user = useStore((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedArtist, setEditedArtist] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);

//UPDATE THE GALLERY MAPPING

  useEffect(() => {
    fetchArtist(artistId);
  }, [artistId]);

  useEffect(() => {
    if (artistOBJ) {
      setEditedArtist(artistOBJ);
      // setProfilePhoto(artistOBJ.profile_pic);
    }
  }, [artistOBJ]);

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
  setEditedArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
const myNewArtist = {...editedArtist, profile_pic: profilePhoto}
    updateArtist(artistId, myNewArtist);
    setIsEditing(false);
  };

  const ideaButton = () => {
    navigate(`/artists/${artistOBJ.id}/ideas`);
  };

  const isMember = artistOBJ?.is_member;

  return artistOBJ ? (
    <div id="artistPage" className="mt-4">
      {isEditing ? (
        <Form>
      <Form.Group className="mb-3">
        <Form.Label>Artist Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={editedArtist.name || ""}
          onChange={handleChange}
          placeholder="Artist Name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Headline Description</Form.Label>
        <Form.Control
          as="textarea"
          name="headline_description"
          value={editedArtist.headline_description || ""}
          onChange={handleChange}
          placeholder="Headline Description"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control
          type="file"
          name="profile_pic"
          onChange={handleChange}
        />
        {isEditing && (<UploadArtistProfileWidget setProfilePhoto={setProfilePhoto}/>)}
        {editedArtist.profile_pic && (
          <img src={editedArtist.profile_pic} alt="Preview" style={{ width: 200, height: "auto" }} />
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>LinkedIn</Form.Label>
        <Form.Control
          type="text"
          name="linkedin"
          value={editedArtist.linkedin || ""}
          onChange={handleChange}
          placeholder="LinkedIn"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Facebook</Form.Label>
        <Form.Control
          type="text"
          name="facebook"
          value={editedArtist.facebook || ""}
          onChange={handleChange}
          placeholder="Facebook"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Instagram</Form.Label>
        <Form.Control
          type="text"
          name="insta"
          value={editedArtist.insta || ""}
          onChange={handleChange}
          placeholder="Instagram"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Website</Form.Label>
        <Form.Control
          type="text"
          name="website"
          value={editedArtist.website || ""}
          onChange={handleChange}
          placeholder="Website"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          name="bio"
          value={editedArtist.bio || ""}
          onChange={handleChange}
          placeholder="Bio"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={editedArtist.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
        />
      </Form.Group>
      <div className="mt-3">
        <Button variant="success" onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={() => setIsEditing(false)} className="ms-2">Cancel</Button>
      </div>
    </Form>
  ) : (
    <>
      <Card className="mb-3">
        <Card.Header>{artistOBJ.name}</Card.Header>
        <Card.Body>
          <p>{artistOBJ.headline_description}</p>
          {artistOBJ.profile_pic && (
            <img src={artistOBJ.profile_pic} alt="Artist" className="rounded-3" style={{ width: 200, height: "auto" }} />
          )}
          <h4>Projects</h4>
          {/* Soundcloud */}
          <div>
            {artistOBJ.soundcloud_id && (
              <iframe width="100%" height="465" sallow="autoplay"
                src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${artistOBJ.soundcloud_id}&amp;`} />
            )}
          </div>
          {/* Artist Photos */}
          {artistOBJ.photos && artistOBJ.photos.length > 0 && (
            <div>
              {artistOBJ.photos.map((photo) => (
                <div key={photo.id}>
                  <img src={photo.image_url} alt={photo.title} />
                  <p>Title:</p>
                  <h5>{photo.title}</h5>
                  <p>Piece description:</p>
                  <p>{photo.description}</p>
                </div>
              ))}
            </div>
          )}
          <img src="{artistOBJ.profile_pic}" />
          <p>{artistOBJ.bio}</p>
          <h5>Links:</h5>
          <p>{artistOBJ.website}</p>
          <p>{artistOBJ.spotify_id}</p>
          <p>{artistOBJ.linkedin}</p>
          <p>{artistOBJ.facebook}</p>
          <p>{artistOBJ.insta}</p>
          <p>{artistOBJ.phone}</p>
          <Button className="idea-button" onClick={ideaButton}>Artist Ideas</Button>
          {isMember && (
            <Button variant="secondary" onClick={() => setIsEditing(true)} className="ms-2">Edit</Button>
          )}
        </Card.Body>
      </Card>
    </>
  )}
</div>
) : (
<p>Loading...</p>
);
}



export default ArtistPage;
