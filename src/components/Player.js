import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //Importing font awesome

//importing specific icons from font awesome
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons"; //faPlay is a specific icon

/////////////////////////////////////////////////////////////////////////

const Player = ({
  audioRef,
  currentSong,
  isPlaying,
  setIsPlaying,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  setSongs,
}) => {
  //useEffect will run when we use the use Effect
  //to updated the Nav when skipping song
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };
  //Event Handler with turnary operator
  const playSongHandler = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying); //switching it on and off
  };

  //formatting the time of the song
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value; //drag and let go of the bar
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id); //means we are on that song
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]); //just adding 1 to the index // if you get to the same number 8 % 8 go back to 0
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        //checks if index -1 === -1 then set it to the last song 8-1=7
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);

        if (isPlaying) audioRef.current.play(); //adding before the return allows to "go-back" and still play the song
        return; // we need to return in order to prevent line 52 from running
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]); //only applies when we skip songs in the middle
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };

  //Add the styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  /////////////////////////////////////////////////////////////////////////

  return (
    <div className="player">
      <div className="time-control">
        {/* start time of song */}
        <p>{getTime(songInfo.currentTime)}</p>

        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
          className="track"
        >
          {/* Sliding bar with type="range" */}
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime} //is the circle thing in the sliding bar
            onChange={dragHandler}
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        {/* end time of the song */}
        {/* gets rid of the NaN with a 0:00 for a split second now */}
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>

      <div className="play-control">
        {/* <FontAwesomeIcon /> is a component we have to include in order to return the icon */}
        {/* back icon arrow */}
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />

        {/* playbutton icon  */}
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />

        {/* {forward icon arrow} */}
        <FontAwesomeIcon
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
          onClick={() => skipTrackHandler("skip-forward")} //if my song is playing show the pause icon // if its not playing show the play icon
        />
      </div>

      {/* this is a html tag */}
    </div>
  );
};

export default Player;
