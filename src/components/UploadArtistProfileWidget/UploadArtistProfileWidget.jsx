import React from "react"
import { useEffect } from "react";
import { useRef } from "react";
import Button from 'react-bootstrap/Button';

const UploadArtistProfileWidget = ({setProfilePhoto}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'dwqjkxlqe',
      uploadPreset: 'my_first_preset',
      // folder: ''
    }, function(error, result) {
      if (!error && result && result.event === "success") {
        console.log('results', result);
        const imageUrl = result.info.secure_url;
        // setEditedArtist((prev) => ({ ...prev, profile_pic: imageUrl }));
        setProfilePhoto(imageUrl);
      }
    }
  );
  }, []);

  return (
    <Button variant="dark" type='button' onClick={() => widgetRef.current.open()}>
      Upload Artist photo
    </Button>
  );
};



export default UploadArtistProfileWidget;
