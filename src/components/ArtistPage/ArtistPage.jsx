import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams, useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap
import "./ArtistPage.css";
import UploadArtistProfileWidget from "../UploadArtistProfileWidget/UploadArtistProfileWidget";
import linkedInPhoto from '/images/InBug-Black.png';
import spotifyPhoto from '/images/Spotify_Primary_Logo_RGB_Black.png';
import facebookPhoto from '/images/facebook-icon-black-cbf5.png';
import instaPhoto from '/images/Instagram_Glyph_Black.png';
import UploadArtistCardWidget from "../UploadArtistCardWidget/UploadArtistCardWidget";


function ArtistPage() {
  //the artist edit page goes blank when you edit it every time you start up the server
  //It is grabbing the new photo but not updating it in the database. I logged into Alex's profile which didn't have a cover photo, updated it and it wouldn't show it while I was logged in as him, but it showed it when I logged out and logged in as myself..?

  const { artistId } = useParams();
  const navigate = useNavigate();
  const artistOBJ = useStore((state) => state.artistOBJ);
  const fetchArtist = useStore((state) => state.fetchArtist);
  const updateArtist = useStore((state) => state.updateArtist);
  const user = useStore((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedArtist, setEditedArtist] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [cardPhoto, setCardPhoto] = useState(null);

  // Modal state for full-size image display
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchArtist(artistId);

    console.log('Artist obj in useEffect:', artistOBJ)
  }, [artistId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedArtist((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const myNewArtist = { ...editedArtist, card_photo: cardPhoto, profile_pic: profilePhoto };
    console.log('card photo', cardPhoto);

    updateArtist(artistId, myNewArtist);
    setIsEditing(false);
  };

  const ideaButton = () => {
    navigate(`/artists/${artistOBJ.id}/ideas`);
  };

  // Image click handler for modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const newPhotoNav = () => {
    navigate(`/photos`);
  };
  

  const isMember = artistOBJ?.is_member;

  return artistOBJ ? (
    <div id="artistPage" className="mt-4">
      {isEditing ? (
        <Form>
          <Form.Group className="mb-3" style={{ borderRadius: '3px' }}>
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
            {isEditing && (<UploadArtistProfileWidget setProfilePhoto={setProfilePhoto}/>)}
            {editedArtist.profile_pic && (
              <img src={editedArtist.profile_pic} alt="Preview" style={{ width: 200, height: "auto" }} />
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            {isEditing && (<UploadArtistCardWidget setCardPhoto={setCardPhoto}/>)}
            {editedArtist.card_photo && (
              <img src={editedArtist.card_photo} alt="Preview" style={{ width: 200, height: "auto" }} />
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
          <Card.Header style={{ fontSize: '2rem' }}>{artistOBJ.name}</Card.Header>
            <Card.Body>
              <p>{artistOBJ.headline_description}</p>
              <h4>Projects</h4>
              {/* Soundcloud */}
              <div>
                {artistOBJ.soundcloud_id && (
                  <iframe width="100%" height="465" sallow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${artistOBJ.soundcloud_id}&amp;`} />
                )}
              </div>
              {/* Artist Portfolio Layout */}
              {artistOBJ.photos && artistOBJ.photos.length > 0 && (
                <>
                  {/* First image large and centered */}
                  <div className="artist-feature">
                    <div className="artist-feature-image">
                      <img src={artistOBJ.photos[0].image_url} alt={artistOBJ.photos[0].title} onClick={() => handleImageClick(artistOBJ.photos[0].image_url)} />
                    </div>
                    <div className="artist-feature-text">
                      <p><strong>{artistOBJ.photos[0].title}</strong></p>
                      <p>{artistOBJ.photos[0].description}</p>
                    </div>
                  </div>

                  {/* 2-column layout for remaining images */}
                  <div className="artist-photo-grid">
                    {artistOBJ.photos.slice(1).map((photo) => (
                      <div key={photo.id} className="photo-tile" onClick={() => handleImageClick(photo.image_url)}>
                        <img src={photo.image_url} alt={photo.title} />
                        <p><strong>{photo.title}</strong></p>
                        <p>{photo.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

             {artistOBJ.profile_pic && (
  <div className="artist-profile-container">
    <img
      src={artistOBJ.profile_pic}
      alt="Artist"
      className="rounded-3"
      style={{ width: 250, height: "auto" }}  // Set width to 400px, 2x larger than before
    />
    <p>{artistOBJ.bio}</p>  {/* Bio text beside the image */}
  </div>
)}

              {(artistOBJ.website || artistOBJ.spotify_id || artistOBJ.linkedin || artistOBJ.facebook || artistOBJ.insta) && (
              <div>
              <h5>Links:</h5>
              </div>
                )}
              {artistOBJ.website && (
                <div>
                <p>Website:</p>
              <a href={artistOBJ.website} target="_blank" rel="noopener noreferrer">{artistOBJ.website}</a>
              </div>
                )}
              {artistOBJ.spotify_id && (
                <div id="linkImg">
             <a href={artistOBJ.spotify_id} target="_blank" rel="noopener noreferrer"> <img id="linkImg" src={spotifyPhoto}/></a>
              </div>
                )}
              {artistOBJ.linkedin && (
                <div id="linkImg">
              <a href={artistOBJ.linkedin} target="_blank" rel="noopener noreferrer"><img id="linkImg" src={linkedInPhoto}/></a>
              </div>
                )}
              {artistOBJ.facebook && (
                <div id="linkImg">
              <a href={artistOBJ.facebook} target="_blank" rel="noopener noreferrer"> <img id="linkImg" src={facebookPhoto}/></a>
              </div>
                )}
              {artistOBJ.insta && (
                <div id="linkImg">
              <a href={artistOBJ.insta} target="_blank" rel="noopener noreferrer"> <img id="linkImg" src={instaPhoto}/></a>
              </div>
                )}
              <p>{artistOBJ.phone}</p>
              <Button className="idea-button" onClick={ideaButton}>Artist Ideas</Button>
              {isMember && (
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="ms-2">Edit profile</Button>
              )}
              <div>
                {user.artist_id && <button onClick={newPhotoNav}>Add art to profile</button>}
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Modal for full-size image */}
      <Modal
  show={showModal}
  onHide={handleCloseModal}
  centered
  size="lg"
  className="custom-modal-size"
>
  <Modal.Header closeButton={false} className="custom-modal-header">
    {/* "X" button to close the modal */}
    <button 
      type="button" 
      className="close-button" 
      onClick={handleCloseModal}
    >
      ×
    </button>
  </Modal.Header>
  <Modal.Body>
    {/* Ensure the image takes up as much space as possible */}
    <img src={selectedImage} alt="Full size" className="img-fluid modal-image" />
  </Modal.Body>
</Modal>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default ArtistPage;
