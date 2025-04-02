import React from "react"
import { useEffect } from "react";
import { useRef } from "react";
import Button from 'react-bootstrap/Button';

const UploadWidget = ({setImageInput, setProfilePhoto}) => {
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
        console.log(result);
        
        setProfilePhoto(result.info.secure_url);
        // setImageInput(result.info.secure_url);
        console.log('Done! Here is the public ID: ', result.info.public_id);
      }
    });
  }, []);

  return (
    <Button variant="dark" type='button' onClick={() => widgetRef.current.open()}>
      Upload photo
    </Button>
  );
};



export default UploadWidget;
