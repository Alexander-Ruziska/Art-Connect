import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../../zustand/store";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import './PostJob.css';

const PostJob = () => {
  const { createJob, user } = useStore();
  const navigate = useNavigate();
  const { id: orgId } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob({
        organization_id: user.organization_id,
        title,
        description,
        deadline,
        is_archived: false,
      });
      navigate("/job-list");
    } catch (err) {
      console.error("Error creating job:", err);
      setError("There was an error posting the job.");
    }
  };

  if (!user?.is_organization) {
    return <p className="text-center mt-5">You must be an organization to post jobs.</p>;
  }

  const inputStyle = { borderRadius: '3px' };

  return (
    <div id="postJobPage" className="container text-center">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={9} lg={8}>
          <div className="text-center mb-1">
            <h2 className="fw-bold">Post a Job</h2>
            <p className="text-muted">Fill out the job details below</p>
          </div>

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Form
            onSubmit={handleSubmit}
            className="border p-5 shadow-sm bg-light"
            style={{ borderRadius: '3px' }}
          >
            <Form.Group className="mb-3" controlId="jobTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter job title"
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="jobDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter job description"
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="jobDeadline">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={inputStyle}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 fw-semibold px-4 py-2"
              style={{ borderRadius: '3px' }}
            >
              Post Job
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default PostJob;
