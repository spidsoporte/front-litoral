/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/auth/Action';
import { AlertSession } from './components/SweetAlerts/Alerts';

const SessionTimeout = () => {
  const [events, setEvents] = useState(['click', 'load', 'scroll', 'mousemove']);
  const [second, setSecond] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const { isLogged } = useSelector((state) => state.auth);

  const dispatch = useDispatch()

  let timeStamp;
  const warningInactiveInterval = useRef();
  const startTimerInterval = useRef();
  let alert = null;
  
  // start inactive check
  const timeChecker = () => {
    startTimerInterval.current = setTimeout(() => {
      const storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
      warningInactive(storedTimeStamp);
      alert = AlertSession(handleClose)
    }, 540000);
  };
  
  // warning timer
  let warningInactive = (timeString) => {
    clearTimeout(startTimerInterval.current);
    
    warningInactiveInterval.current = setInterval(() => {
      const maxTime = 10;
      const popTime = 1;
      
      const diff = moment.duration(moment().diff(moment(timeString)));
      const minPast = diff.minutes();
      const leftSecond = 60 - diff.seconds();
      
      console.log(minPast);
      console.log(leftSecond);
      
      if (minPast === popTime) {
        setSecond(leftSecond);
        setOpen(true);
      }
      
      if (minPast === maxTime) {
        console.log('siu');
        clearInterval(warningInactiveInterval.current);
        setOpen(false);
        sessionStorage.removeItem('lastTimeStamp');
        dispatch(logout());
      }
    }, 1000);
  };

  // reset interval timer
  const resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);
    
    if (isLogged) {
      timeStamp = moment();
      sessionStorage.setItem('lastTimeStamp', timeStamp);
    } else {
      clearInterval(warningInactiveInterval.current);
      sessionStorage.removeItem('lastTimeStamp');
    }
    timeChecker();
    setOpen(false);
  }, [isLogged]);

  // handle close popup
  const handleClose = () => {
    setOpen(false);
    
    resetTimer();
  };


  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    
    timeChecker();
    
    return () => {
      clearTimeout(startTimerInterval.current);
      //   resetTimer();
    };
  }, [resetTimer, events, timeChecker]);

  if (!isOpen) {
    return null;
  }

  // change fragment to modal and handleclose func to close
  return <>{isLogged && alert}</>;




};

export default SessionTimeout;
