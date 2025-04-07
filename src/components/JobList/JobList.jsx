import React, { useEffect, useState } from "react";
import moment from "moment";
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Form, Card } from "react-bootstrap";
import { FaArchive, FaTrashRestoreAlt } from "react-icons/fa";
import './JobList.css';

function JobList() {
  const {
    jobs,
    expressInterest,
    withdrawInterest,
    fetchArtistRequests,
    updateJob,
    artistRequests = [],
    user,
  } = useStore();

  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.artist_id) {
      fetchArtistRequests();
    }
  }, [fetchArtistRequests, user.artist_id]);

  const filteredJobs = jobs.filter((job) => {
    if (user.artist_id) return !job.is_archived;
    if (user.is_organization) {
      return (
        job.organization_id === user.organization_id &&
        job.is_archived === showArchived
      );
    }
    return false;
  });

  return (
    <div id="homePage" className="container text-center">
      <h1 className="mb-4">📋 Job Listings</h1>

      {user.is_organization && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="success"
            onClick={() => navigate(`/post-job/${user.organization_id}`)}
          >
            ➕ Post New Job
          </Button>

          <Form.Check
            type="switch"
            id="archive-switch"
            label={showArchived ? "🔴 Viewing Archived" : "🟢 Viewing Active"}
            checked={showArchived}
            onChange={() => setShowArchived(!showArchived)}
          />
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <p className="text-muted">No jobs available.</p>
      ) : (
        <div className="row justify-content-center">
          {filteredJobs.map((job) => {
            const hasRequested = artistRequests.some(
              (req) => req.job_id === job.id
            );

            return (
              <div key={job.id} className="col-md-6 mb-4">
                <Card className={`shadow-sm ${job.is_archived ? "bg-light border-warning" : ""}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title className="mb-0">
                        {job.title}
                        {job.is_archived && (
                          <Badge bg="warning" className="ms-2">Archived</Badge>
                        )}
                      </Card.Title>
                      <small className="text-muted">
                        🗓 {moment(job.deadline).format("MMM Do YYYY")}
                      </small>
                    </div>

                    <Card.Text className="mt-2">{job.description}</Card.Text>

                    {user.artist_id && !job.is_archived && (
                      <Button
                        size="sm"
                        variant={hasRequested ? "outline-danger" : "light"}
                        onClick={() =>
                          hasRequested
                            ? withdrawInterest(job.id)
                            : expressInterest(job.id)
                        }
                        style={{ borderRadius: "3px", border: "1px solid black", backgroundColor: "#e0e0e0", padding: "6px 12px", fontSize: "1rem" }}>
                        {hasRequested ? "Withdraw Interest" : "I'm Interested"}
                      </Button>
                    )}

                    {user.is_organization && (
                      <Button
                        variant={job.is_archived ? "secondary" : "outline-secondary"}
                        size="sm"
                        className="ms-2"
                        onClick={() =>
                          updateJob(job.id, { is_archived: !job.is_archived })
                        }
                      >
                        {job.is_archived ? (
                          <>
                            <FaTrashRestoreAlt className="me-1" /> Unarchive
                          </>
                        ) : (
                          <>
                            <FaArchive className="me-1" /> Archive
                          </>
                        )}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default JobList;
