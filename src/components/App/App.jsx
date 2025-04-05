import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import {
  Routes,
  Route,
  Navigate,
  useLocation 
} from "react-router-dom";

import useStore from '../../zustand/store';
import Nav from '../Nav/Nav';
import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import OrganizationList from '../OrganizationList/OrganizationList';
import ArtistList from '../ArtistList/ArtistList';
import ArtistPage from '../ArtistPage/ArtistPage';
import JobList from '../JobList/JobList';
import ArtistIdea from '../ArtistIdea/ArtistIdea';
import OrganizationPage from '../OrganizationPage/OrganizationPage';
import IdeaForm from '../IdeaForm/IdeaForm';
import EditMedia from '../EditMedia/EditMedia';
import PostJob from '../PostJob/PostJob';
import AdminPage from '../AdminPage/AdminPage';
import ArtistJobRequests from '../ArtistJobRequests/ArtistJobRequests';
import OrgJobRequests from '../OrgJobRequests/OrgJobRequests';

function App() {
  const location = useLocation(); 

  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);
  const fetchArtists = useStore((state) => state.fetchArtists);
  const fetchJobs = useStore((state) => state.fetchJobs);

  useEffect(() => {
    fetchUser();
    fetchArtists();
    fetchJobs();
  }, [fetchUser, fetchArtists, fetchJobs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Container>
        <header>
          <Nav />
        </header>
        <main>
          <Routes>
            <Route 
              exact path="/"
              element={user.id ? <HomePage /> : <HomePage />}
            />
            <Route 
              exact path="/login"
              element={user.id ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route 
              exact path="/registration"
              element={user.id ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route 
              exact path="/admin"
              element={user?.is_admin ? <AdminPage /> : <Navigate to="/" replace />}
            />
            <Route 
              exact path="/artists"
              element={user.id ? <ArtistList /> : <ArtistList />}
            />
            <Route 
              exact path="/job-list"
              element={user.id ? <JobList /> : <LoginPage />}
            />
            <Route 
              exact path="/ideas"
              element={user.artist_id ? <IdeaForm /> : <RegisterPage />}
            />
            <Route 
              exact path="/organization-list/:organizationId"
              element={user.id ? <OrganizationPage /> : <OrganizationPage />}
            />
            <Route 
              exact path="/organization-list"
              element={user.id ? <OrganizationList /> : <OrganizationList />}
            />
            <Route 
              exact path="/post-job/:id"
              element={user?.is_organization ? <PostJob /> : <p>You must be an organization to post a job.</p>}
            />
            <Route 
              exact path="/my-job-requests"
              element={user.artist_id ? <ArtistJobRequests /> : <Navigate to="/login" />}
            />
            <Route 
              exact path="/job-requests"
              element={user.organization_id ? <OrgJobRequests /> : <Navigate to="/login" />}
            />
            <Route path='/artists/:artistId' element={<ArtistPage />} />
            <Route path='/artists/:artistId/ideas' element={<ArtistIdea />} />
            <Route path='/photos' element={<EditMedia />} />
            <Route 
              exact path="/about"
              element={
                <>
                  <h2>About Page</h2>
                  <p>
                    Intelligence doesn’t seem like an aspect of personal character, and it isn’t.
                    Coincidentally, great intelligence is only loosely connected to being a good programmer.
                  </p>
                  <p>What? You don’t have to be superintelligent?</p>
                  <p>
                    No, you don’t. Nobody is really smart enough to program computers.
                    Fully understanding an average program requires an almost limitless capacity
                    to absorb details and an equal capacity to comprehend them all at the same time.
                    The way you focus your intelligence is more important than how much intelligence you have…
                  </p>
                  <p>
                    …most of programming is an attempt to compensate for the strictly limited size of our skulls.
                    The people who are the best programmers are the people who realize how small their brains are.
                    They are humble. The people who are the worst at programming are the people who refuse to
                    accept the fact that their brains aren’t equal to the task.
                    Their egos keep them from being great programmers.
                    The more you learn to compensate for your small brain, the better a programmer you’ll be.
                    <span className="squiggle"> The more humble you are, the faster you’ll improve.</span>
                  </p>
                  <p>--From Steve McConnell's <em>Code Complete</em>.</p>
                </>
              }
            />
            <Route path="*" element={<h2>404 Page</h2>} />
          </Routes>
        </main>
        <footer>
        <p style={{ bottom: 1, marginTop: '20px' }}>Copyright © {new Date().getFullYear()}</p>
        </footer>
      </Container>
    </>
  );
}

export default App;
