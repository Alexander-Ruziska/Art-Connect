import { useState } from "react";
import useStore from "../../zustand/store";
import { Form, Button, Row, Col } from "react-bootstrap";
import "./IdeaForm.css";


function IdeaForm(props) {
  //Zustand store info
    const addIdea = useStore((state) => state.addIdea);
    const navigate = useNavigate();

  const [titleInput, setTitleInput] = useState('');
  const [ideaInput, setIdeaInput] = useState('');

  // This is the form handler to add the new ideas once the submit button is clicked on
  const formHandler = (event) => {
    event.preventDefault();

    const newIdea = {
      title: titleInput,
      idea: ideaInput,
    };

    console.log("New idea", newIdea);

    addIdea(newIdea);


    // This is getting rid of the prior inputs in the form
    setTitleInput('');
    setIdeaInput('');
  };

      //navigating back to their idea list
      navigate(-1);
    }


  const inputStyle = { borderRadius: '3px' };

  return (
    <div id="ideaFormPage">
      <div className="form-wrapper container text-center">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={9} lg={8}>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Submit a New Idea</h2>
              <p className="text-muted">
                Share your project idea to help organizations discover and support your work.
              </p>
            </div>

            <Form
              onSubmit={formHandler}
              className="border shadow-sm bg-light"
              style={{ borderRadius: '3px', padding: '30px' }}
            >
              {/* title */}
              <Form.Group className="mb-3" controlId="ideaTitle">
                <Form.Label>Title of Project:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              {/* idea */}
              <Form.Group className="mb-4" controlId="ideaDescription">
                <Form.Label>Idea Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Description"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold px-4 py-2"
                style={{ borderRadius: '3px' }}
              >
                Submit Idea
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default IdeaForm;
