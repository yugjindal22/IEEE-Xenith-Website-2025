import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { About, Contact, Events, Gallery, Home, Team, Timeline } from "./pages";
import Snowfall from "react-snowfall";

const App = () => {
  return (
    <main >
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/*'
            element={
              <>
                <Routes>
                  <Route path='/about' element={
                    <>
                      <Snowfall
                        style={{
                          position: "fixed",
                          width: "100vw",
                          height: "100vh",
                          zIndex: 1,
                        }}
                      />
                      <About />
                    </>
                  } />
                  <Route path='/timeline' element={
                    <>
                      <Snowfall
                        style={{
                          position: "fixed",
                          width: "100vw",
                          height: "100vh",
                          zIndex: 1,
                        }}
                      />
                      <Timeline />
                    </>
                  } />
                  <Route path='/events' element={
                    <>
                      <Snowfall
                        style={{
                          position: "fixed",
                          width: "100vw",
                          height: "100vh",
                          zIndex: 1,
                        }}
                      />
                      <Events />
                    </>
                  } />
                  
                    <Route path='/gallery' element={
                    <>
                      <Snowfall
                        style={{
                          position: "fixed",
                          width: "100vw",
                          height: "100vh",
                          zIndex: 1,
                        }}
                      />
                      <Gallery />
                    </>
                  } />

                  
                  <Route path='/team' element={<Team />} />

                  <Route path='/contact' element={<Contact />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
