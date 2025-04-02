import React, { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams, useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen/index";
// import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import UploadWidget from "../UploadWidget/UploadWidget";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import axios from "axios";

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

  useEffect(() => {
    fetchArtist(artistId);
  }, [artistId]);

  useEffect(() => {
    if (artistOBJ) {
      setEditedArtist(artistOBJ);
      setProfilePhoto(artistOBJ.profile_pic);
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
    const { name, value, files } = e.target;
    if (name === "profile_pic" && files.length) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset");

      axios
        .post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData)
        .then((response) => {
          const imageUrl = response.info.secure_url;
          setEditedArtist((prev) => ({ ...prev, profile_pic: imageUrl }));
          setProfilePhoto(imageUrl);
        })
        .catch((error) => console.error("Image upload failed:", error));
    } else {
      setEditedArtist((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    await updateArtist(artistId, editedArtist); // make sure this works
    setIsEditing(false);
  };

  const ideaButton = () => {
    navigate(`/artists/${artistOBJ.id}/ideas`);
  };

  const isMember = artistOBJ?.is_member;

  return artistOBJ ? (
    <div id="artistPage">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={editedArtist.name || ""}
            onChange={handleChange}
            placeholder="Artist Name"
          />
          <textarea
            name="headline_description"
            value={editedArtist.headline_description || ""}
            onChange={handleChange}
            placeholder="Headline Description"
          />
          <input
            type="file"
            name="profile_pic"
            onChange={handleChange}
          />
          {isEditing && (<UploadWidget />)}
          {profilePhoto && (
            <img src={profilePhoto} alt="Preview" style={{ width: 200, height: "auto" }} />
          )}
          <input
            type="text"
            name="linkedin"
            value={editedArtist.linkedin || ""}
            onChange={handleChange}
            placeholder="LinkedIn"
          />
          <input
            type="text"
            name="facebook"
            value={editedArtist.facebook || ""}
            onChange={handleChange}
            placeholder="Facebook"
          />
          <input
            type="text"
            name="insta"
            value={editedArtist.insta || ""}
            onChange={handleChange}
            placeholder="Instagram"
          />
          <input
            type="text"
            name="website"
            value={editedArtist.website || ""}
            onChange={handleChange}
            placeholder="Website"
          />
          <textarea
            name="bio"
            value={editedArtist.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
          />
          <input
            type="text"
            name="phone"
            value={editedArtist.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1>{artistOBJ.name}</h1>
          <p>{artistOBJ.headline_description}</p>
          {artistOBJ.profile_pic && (
            <img src={artistOBJ.profile_pic} alt="Artist" style={{ width: 200, height: "auto" }} />
          )}
          <h4>Projects</h4>

          {/* Code for soundcloud */}
          <div>
            {artistOBJ.soundcloud_id &&
                <iframe width="100%" height="465" sallow="autoplay"
                src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${artistOBJ.soundcloud_id}&amp;`}>
        </iframe> }
          </div>
          {artistOBJ.photos && artistOBJ.photos.length > 0 && (
            <div>
              {artistOBJ.photos.map((photo) => (
                <div key={photo.id}>
                  <img src={photo.image_url} alt={photo.title} />
                  <h5>{photo.title}</h5>
                  <p>{photo.description}</p>
                </div>
              ))}
            </div>
          )}

          <p>{artistOBJ.bio}</p>
          <h5>Links:</h5>
          <p>{artistOBJ.website}</p>
          <p>{artistOBJ.spotify_id}</p>
          <p>{artistOBJ.linkedin}</p>
          <p>{artistOBJ.facebook}</p>
          <p>{artistOBJ.insta}</p>
          <p>{artistOBJ.phone}</p>

          <button id={artistOBJ.id} onClick={ideaButton}>
            Artist Ideas
          </button>

          {isMember && (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default ArtistPage;
