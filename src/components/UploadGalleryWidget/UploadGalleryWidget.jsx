import React from "react"
import { useEffect } from "react";
import { useRef } from "react";
import Button from 'react-bootstrap/Button';

const UploadGalleryWidget = ({setImageInput}) => {
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
        
        setImageInput(result.info.secure_url);
        console.log('Done! Here is the public ID: ', result.info.public_id);
      }
    });
  }, []);

  return (
    <Button
  variant="dark"
  type="button"
  onClick={() => widgetRef.current.open()}
  style={{ borderRadius: '3px' }} 
>
  Upload photo
</Button>

  );
};



export default UploadGalleryWidget;
