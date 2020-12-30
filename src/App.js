//importing our components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
//Importing CSS
import "./styles/app.scss";
//Import Data info
import data from "./data";
//State
import { useState, useRef } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";

function App() {
  //useRef
  const audioRef = useRef(null); //null is the starting value
  //State
  const [songs, setSongs] = useState(data()); //all of our songs
  const [currentSong, setCurrentSong] = useState(songs[0]); //this grabs the first song of the array of objects
  const [isPlaying, setIsPlaying] = useState(false); //is this song playing, yes or no?
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //Calculate percentage of song
    const roundedCurrent = Math.round(current); //getting rid of all the decimals
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    }); //updating our state
    //update the currentTime to the variable "current" and the "duration" variable
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id); //means we are on that song
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]); //just adding 1 to the index // if you get to the same number 8 % 8 go back to 0
    if (isPlaying) audioRef.current.play();
  };
  /////////////////////////////////////////////////////////////////////////
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      {/* returning our components and passing our state to our component */}
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        audioRef={audioRef}
        currentSong={currentSong}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio
        // passing the mp3 audio
        src={currentSong.audio}
        onTimeUpdate={timeUpdateHandler} //runs everytime the time changes in the audio
        onLoadedMetadata={timeUpdateHandler} //set up the end time once page gets loaded
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
