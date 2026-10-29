import "./App.css";
import "flowbite";
import { useDispatch, useSelector } from "react-redux";
import { About } from "./pages/About";
import { Dashboard } from "./components/Dashboard";
import { NavbarEl } from "./components/NavbarEl";
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { useEffect, useRef, useState } from "react";
import { logInOffMemory, setDarkMode } from "./redux/social";
import { BottomNav } from "./components/BottomNav";
import { Feed } from "./pages/Feed";
import { LearnAboutUs } from "./pages/LearnAboutUs";
import { SearchUsers } from "./pages/SearchUsers";
import { ViewUser } from "./pages/ViewUser";
import { ViewFollowers } from "./pages/ViewFollowers";
import { ViewFollowing } from "./pages/ViewFollowing";

function App() {
     const { darkMode, loggedIn } = useSelector((state) => state.socialKey);
     const dispatch = useDispatch();
     const keepLoggedIn = () => {
          if (localStorage.getItem("loggedInIndividual") == "undefined") return;
          const personAlreadyLoggedIn = JSON.parse(localStorage.getItem("loggedInIndividual"));
          // look in memory, to see if somebody  has already logged in!, have the question mark here because if noone has logged in yet, the property doesn't exist yet- question mark means ONLY when this property exists!
          if (personAlreadyLoggedIn) {
               // console.log("someone logged in");
               //if someone was already logegd in-
               return dispatch(logInOffMemory(personAlreadyLoggedIn));
               //   make sure they remain logged in
          } else {
               return;
          }
     };
     useEffect(() => {
          keepLoggedIn();
     }, []);

     useEffect(() => {
          const dMode = JSON.parse(localStorage.getItem("darkMode"));

          dispatch(setDarkMode(dMode));
     }, [darkMode]);

     const [whatWasClicked, setWhatwasClicked] = useState(null);

     return (
          <BrowserRouter>
               <div
                    onClick={(e) => setWhatwasClicked(e.target)}
                    className={`${darkMode ? "dark" : ""} wholeContainer dark:bg-black pt-[5.5rem] sm:pt-[6rem]`}
               >
                    <NavbarEl whatJustGotClicked={whatWasClicked} />
                    <div className="appNotNavContainer pb-20 h-min">
                         <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/About" element={<About />} />
                              <Route path="/Feed" element={<Feed />} />
                              <Route path="/Search" element={<SearchUsers />} />

                              <Route path="/LearnMore" element={<LearnAboutUs />} />
                              <Route path="/ViewUser" element={<ViewUser />} />
                              <Route path="/ViewFollowers" element={<ViewFollowers />} />
                              <Route path="/ViewFollowing" element={<ViewFollowing />} />
                         </Routes>
                    </div>
                    {loggedIn ? <BottomNav /> : ""}
               </div>
          </BrowserRouter>
     );
}

export default App;
