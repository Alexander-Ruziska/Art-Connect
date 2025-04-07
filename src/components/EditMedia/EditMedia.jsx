import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import UploadGalleryWidget from "../UploadGalleryWidget/UploadGalleryWidget";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./EditMedia.css";

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
          cloudName: 'dk6cndcmh'
        }
      });
  
        // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
    const myImage = cld.image('docs/result.info.public_id'); 
      myImage.resize(fill().width(150).height(150));  // Resize image using the 'fill' action


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
    <div className="artist-idea-container">
      <div className="form-wrapper container text-center">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={9} lg={8}>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Just Add Art!</h2>
              <p className="text-muted">
                Upload a photo to your artist profile below:
              </p>
            </div>

            <Form onSubmit={photoHandler} className="border shadow-sm bg-light p-4 rounded-1">
              {/* Title */}
              <Form.Group className="mb-3" controlId="photoTitle">
                <Form.Label>Title of Piece:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  required
                  className="form-input"
                  style={{ borderRadius: '3px' }}
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4" controlId="photoDescription">
                <Form.Label>Description of Piece:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Description"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  required
                  className="form-input"
                  style={{ borderRadius: '3px' }}
                />
              </Form.Group>

              {/* Upload Photo */}
              <Form.Group className="mb-4" controlId="uploadedPhoto">
                <UploadGalleryWidget setImageInput={setImageInput} />
                <div>
                  <label style={{ marginTop: '20px' }}>Uploaded Photo:</label>
                  <input
                    placeholder={imageInput}
                    readOnly
                    style={{
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: '80%', // Adjust the width as needed
                      borderRadius: '3px',
                      padding: '10px'
                    }}
                  />

                  {imageInput && (
                    <img
                      id="uploadedPhoto"
                      src={imageInput}
                      height={200}
                      width={200}
                      alt="Uploaded Preview"
                      style={{ borderRadius: '3px', marginTop: '10px' }}
                    />
                  )}
                </div>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold px-4 py-2 rounded-1"
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default EditMedia;
