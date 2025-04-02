import React from "react";
import { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
// import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import UploadGalleryWidget from "../UploadGalleryWidget/UploadGalleryWidget";
import { image } from "@cloudinary/url-gen/qualifiers/source";


function EditMedia() {
    const user = useStore((state) => state.user);
    const addPhoto = useStore((state) => state.addPhoto);
    const navigate = useNavigate();
    const [imageInput, setImageInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');
    

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


//----REGULAR FORM INFO----//


    const photoHandler = (event) => {
        event.preventDefault();


        const newPhoto = {
            artist_id: user.artist_id,
            image_url: imageInput,
            title: titleInput,
            description: descriptionInput
        }

        console.log('New Photo:', newPhoto);

        addPhoto(newPhoto);

        //The code below is getting rid of the prior inputs
        setImageInput('');
        setTitleInput('');
        setDescriptionInput('');

        //navigate to artists profile page -INSERT CODE BELOW-
        // navigate('');
    };


  return (
    <div>
        <h3>Just add art!</h3>
        <p>Upload a photo to your artist profile below:</p>   
        <section>
            <form id="form" onSubmit={photoHandler} >


            {/* Title */}
            <label>Title of piece:</label>
            <input type="text" placeholder="Title" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} required/>

            {/* Description */}
            <label>Description of piece:</label>
            <input type="text" placeholder="Description" value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} required/>
            
            {/* Adding photo */}
            <UploadGalleryWidget setImageInput={setImageInput}/>
            <div>
            <label>Uploaded Photo:</label>
            <input placeholder={imageInput} /> 
            {imageInput && <img id="uploadedPhoto" src={imageInput} height={200} width={200} />}
            </div>

            <button type='submit'>Submit</button>
            </form>
        </section>   
    </div>
  )
};

export default EditMedia;
