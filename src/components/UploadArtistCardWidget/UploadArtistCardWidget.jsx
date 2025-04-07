import React from "react"
import { useEffect } from "react";
import { useRef } from "react";
import Button from 'react-bootstrap/Button';

const UploadArtistCardWidget = ({setCardPhoto}) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'dk6cndcmh',
      uploadPreset: 'art_connect',
      folder: 'Art-Connect'
    }, function(error, result) {
      if (!error && result && result.event === "success") {
        console.log('results', result);
        const cardImageUrl = result.info.secure_url;
        // setEditedArtist((prev) => ({ ...prev, profile_pic: imageUrl }));
        setCardPhoto(cardImageUrl);
      }
    }
  );
  }, []);

  return (
    <Button variant="dark" type='button' onClick={() => widgetRef.current.open()}>
      Upload Cover photo
    </Button>
  );
};



export default UploadArtistCardWidget;