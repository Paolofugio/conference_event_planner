import React, { useState } from "react";
import "./App.css";
import ConferenceEvent from "./ConferenceEvent";
import AboutUs from "./AboutUs";

const App: React.FC = () => {
  const [showVenue, setShowVenue] = useState<boolean>(false);

  const handleGetStarted = (): void => {
    setShowVenue(true);
  };

  return (
    <>
      <header className="first_page">
        <div className="main_event">
          <div className="first_page_name_btn">
            <h1 className="budget_heading">Conference Expense Planner</h1>
            <p className="budget_sentence">Plan your next major event with us!</p>
            <div className="getstarted_btn">
              <button onClick={handleGetStarted} className="get-started-btn">
                Get Started
              </button>
            </div>
          </div>
          <div className="aboutus_main">
            <AboutUs />
          </div>
        </div>
      </header>

      <div className={`event-list-container ${showVenue ? "visible" : ""}`}>
        <ConferenceEvent />
      </div>
    </>
  );
};

export default App;
