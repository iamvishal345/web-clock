import { useEffect, useRef, useState } from "react";
import "./index.css";
import sun from "../../assets/svg/sun.svg";
import moon from "../../assets/svg/moon.svg";

const GREETING_TEXT = new Map([
  [22, "Working Late"],
  [18, "Good Evening"],
  [12, "Good Afternoon"],
  [6, "Good Morning"],
  [0, "Whoa, Early Bird"],
]);
GREETING_TEXT.keys();
export const Clock = ({ updateBgPath }) => {
  const controller = useRef(null);
  const [showPanel, setShowPanel] = useState(false);
  const [time, setTime] = useState(null);
  const [timeZone, setTimeZone] = useState(null);
  const [calender, setCalender] = useState(null);

  const fetchTimeZone = async () => {
    controller.current?.abort();
    controller.current = new AbortController();
    try {
      const res = await fetch("https://ipv6.jsonip.com/", {
        signal: controller.current.signal,
      });
      const { ip } = await res.json();
      const timeZoneRes = await fetch(`https://geolocation-db.com/json/${ip}`, {
        signal: controller.current.signal,
      });
      const timeZone = await timeZoneRes.json();
      timeZone.name = Intl?.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(timeZone);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDateAndTime = () => {
    const current = new Date();
    if (current.getMinutes() !== time?.minutes) {
      const timeObj = {
        hours: current.getHours(),
        minutes: current.getMinutes(),
      };
      if (time?.hours !== current.getHours) {
        timeObj.greeting = [...GREETING_TEXT.entries()].find(
          ([key]) => key <= current.getHours()
        )[1];
        const calenderObj = {};
        const dataArr = Intl?.DateTimeFormat("default", {
          day: "numeric",
          weekday: "long",
          month: "long",
          timeZoneName: "long",
        }).formatToParts();

        dataArr.forEach(({ type, value }) => {
          if (type === "literal") return;
          if (type === "timeZoneName") timeObj.timeZoneName = value;
          else {
            calenderObj[type] = value;
          }
        });
        calenderObj.dayOfWeek = current.getDay();
        const dayOfYear = Math.floor(
          (current - new Date(current.getFullYear(), 0, 0)) /
            1000 /
            60 /
            60 /
            24
        );
        calenderObj.dayOfYear = dayOfYear;
        calenderObj.weekNumber = Math.floor(dayOfYear / 7);
        setCalender(calenderObj);
        updateBgPath();
      }
      setTime(timeObj);
    }
    requestAnimationFrame(getDateAndTime);
  };

  useEffect(() => {
    fetchTimeZone();
    requestAnimationFrame(getDateAndTime);
    return () => {
      controller.current?.abort();
    };
  }, []);

  if (!time || !timeZone || !calender) return null;

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div className="clock_container">
      <div className="clock_top">
        <img
          src={time.hours > 19 || time.hours < 6 ? moon : sun}
          alt={time.hours > 19 || time.hours < 6 ? "moon icon" : "sun icon"}
        />
        <p className="clock_greeting_text">{time.greeting}, IT'S CURRENTLY</p>
      </div>
      <div className="clock_time_container">
        <p className="clock_time">
          {time.hours.toString().padStart(2, 0)}:
          {time.minutes.toString().padStart(2, 0)}
        </p>
        <p className="clock_timezone">{time.timeZoneName}</p>
        <p className="clock_date">
          {calender.weekday}, {calender.month} {calender.day}
        </p>
      </div>
      <div className="clock_bottom">
        <p className="clock_location">
          IN {timeZone?.city || ""}, {timeZone?.country_name || ""}
        </p>
        <button className="clock_more_btn" onClick={togglePanel}>
          {showPanel ? "LESS" : "MORE"}{" "}
          <i className={`arrow ${showPanel ? "up" : "down"}`}></i>
        </button>
      </div>
      <div className={`clock_bottom_panel ${showPanel ? "active" : ""}`}>
        <div className="clock_bottom_panel_section">
          <dl>
            <dt>CURRENT TIMEZONE</dt>
            <dd>{timeZone.name}</dd>
            <dt>DAY OF THE YEAR</dt>
            <dd>{calender.dayOfYear}</dd>
          </dl>
        </div>
        <div className="clock_bottom_panel_section">
          <dl>
            <dt>DAY OF THE WEEK</dt>
            <dd>{calender.dayOfWeek}</dd>
            <dt>WEEK NUMBER</dt>
            <dd>{calender.weekNumber}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
};
