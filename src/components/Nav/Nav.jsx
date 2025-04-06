import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from 'react-router-dom';
import { useState } from "react";
import useStore from "../../zustand/store";
import { useNavigate } from 'react-router-dom';

function Navi() {
  const user = useStore((store) => store.user);
  const [expanded, setExpanded] = useState(false);
  const logOut = useStore((state) => state.logOut);
  const navigate = useNavigate();

  const logOutFunction = () => {
    setExpanded(false);
    logOut();
    navigate('/login');
  }

  return (
    <Col>
      <Navbar data-bs-theme="dark" expanded={expanded} onToggle={() => setExpanded(!expanded)} collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top">
        <Container fluid>
          <Navbar.Brand>Art Connect</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              
              {!user.id && (
                <>
                  <Nav.Item>
                    <NavLink className="nav-link" to="/registration" onClick={() => setExpanded(false)}>Register</NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink className="nav-link" to="/login" onClick={() => setExpanded(false)}>Login</NavLink>
                  </Nav.Item>
                </>
              )}
              
              <Nav.Item>
                <NavLink className="nav-link" to="/" onClick={() => setExpanded(false)}>Home</NavLink>
              </Nav.Item>

              {user.artist_id && (
                <>
                  <Nav.Item>
                    <NavLink className="nav-link" to={`/artists/${user.artist_id}`} onClick={() => setExpanded(false)} >
                    Profile
                    </NavLink>
                  </Nav.Item>
                </>
              )}

              {user.organization_id && (
                <>
                  <Nav.Item>
                    <NavLink className="nav-link" to={`/organization-list/${user.organization_id}`} onClick={() => setExpanded(false)} >
                    Profile
                    </NavLink>
                  </Nav.Item>
                </>
              )}
              
              <Nav.Item>
                <NavLink className="nav-link" to="/artists" onClick={() => setExpanded(false)}>Artists List</NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink className="nav-link" to="/organization-list" onClick={() => setExpanded(false)}>Organizations List</NavLink>
              </Nav.Item>

              {user.id && (
                <>
                  <Nav.Item>
                    <NavLink className="nav-link" to="/job-list" onClick={() => setExpanded(false)}>Jobs Listings</NavLink>
                  </Nav.Item>
                  {user.artist_id && (
                    <Nav.Item>
                      <NavLink className="nav-link" to="/my-job-requests" onClick={() => setExpanded(false)}>
                        My Jobs
                      </NavLink>
                    </Nav.Item>
                  )}

                  {user.organization_id && (
                    <Nav.Item>
                      <NavLink className="nav-link" to="/job-requests" onClick={() => setExpanded(false)}>
                        Manage Requests
                      </NavLink>
                    </Nav.Item>
                  )}
                                {user?.is_admin && (
                <Nav.Item>
                  <NavLink className="nav-link" to="/admin" onClick={() => setExpanded(false)}>Admin</NavLink>
                </Nav.Item>
              )}
                    <Nav.Item>
                    <NavLink className="nav-link" to="/login" onClick={logOutFunction}>Logout</NavLink>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col>
  );
}

export default Navi;
