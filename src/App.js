import React from "react";
import "./App.css";
import ReactPlayer from "react-player";

function App() {
  return (
    <div>
      <ReactPlayer
        className="react-player fixed-bottom"
        url="../video"
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
}

export default App;
