import React, { useState, useEffect, useCallback } from 'react';
import ShowTimer from './ShowTimer';
import "../Style/DateTime.css";

const DateTime = () => {
  const [targetDateTime, setTargetDateTime] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [countdownOver, setCountdownOver] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false); // Track if timer has started


  //When Start The serever that time to show the current date and time to input field
  //>>>>>>>>>>>>>>>>>>>>>>>>>>
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    // Set the default value for targetDateTime to current date and time when the component mounts
    setTargetDateTime(getCurrentDateTime());
  }, []); 
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  
  const startTimer = useCallback(() => {
      const targetTime = new Date(targetDateTime).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;
  
      if (difference > 0) {
        setRemainingTime(difference);
        if (countdownOver) {
          setCountdownOver(false); // Reset countdownOver state if it was true
        }
  
        const id = setInterval(() => {
          const currentTime = new Date().getTime();
          const newDifference = targetTime - currentTime;
  
          if (newDifference <= 0) {
            clearInterval(id);
            setRemainingTime(0);
            setCountdownOver(true); // Set countdownOver state to true
          } else {
            setRemainingTime(newDifference);
          }
        }, 1000);
  
        setTimerId(id);
        setTimerStarted(true); // Set timerStarted to true when timer is started
      }else {
        setCountdownOver(true); // Set countdownOver to true if targetDateTime is in the past
      }
    },[targetDateTime, countdownOver]);
  
    const stopTimer = () => {
      clearInterval(timerId);
      setTimerId(null);
    };
  
    const handleDateTimeChange = (event) => {
      const { value } = event.target;
      // Validate input against maximum days
      const maxDaysFromNow = 99;
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + maxDaysFromNow);

      const selectedDate = new Date(value);
      if (selectedDate > maxDate) {
        alert(`Please select a date within ${maxDaysFromNow} days from now.`);
        return;
      }
      setTargetDateTime(value);
      setTimerStarted(false); // Reset timerStarted state when input is given
  };
  
  const resetTimer = () => {
    clearInterval(timerId);
    setTimerId(null);
    setTargetDateTime("");
    setRemainingTime(0);
    setCountdownOver(false);
    setTimerStarted(false); // Reset timerStarted state when timer is reset
  };
  
    useEffect(() => {
      if (timerId !== null &&timerStarted) {
        clearInterval(timerId);
        startTimer();
      }
    }, [targetDateTime,timerStarted,startTimer,timerId]);
  
    useEffect(() => {
      return () => {
        if (timerId !== null) {
          clearInterval(timerId);
        }
      };
    }, [timerId]);

  return (
    <div className="container">
      <h1 className="heading">Countdown Timer</h1>
      <div className="input">
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={handleDateTimeChange}
        />
        <div>
          <button onClick={startTimer}>Start Timer</button>
          <button onClick={stopTimer}>Stop Timer</button>
          <button onClick={resetTimer}>Reset Timer</button>
        </div>
      </div>
      <div className="wrap">
      {countdownOver ? ( // Conditionally render the message when countdown is over
          <p>The countdown is over. What's next on your adventure?</p>
        ) : (
          <>
            <ShowTimer time={Math.floor(remainingTime / (1000 * 60 * 60 * 24))} date={"Days"} />
            <ShowTimer time={Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} date={"Hours"} />
            <ShowTimer time={Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))} date={"Minutes"} />
            <ShowTimer time={Math.floor((remainingTime % (1000 * 60)) / 1000)} date={"Seconds"} />
          </>
        )}
      </div>
    </div>
  );
};

export default DateTime;
