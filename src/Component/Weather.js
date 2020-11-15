import React, { useEffect, useState } from "react";
import "./Weather.scss";

function Weather({ weatherForecastData, onSelectWeather }) {
  const [weather, setWeather] = useState([]);
  const [selectweather, setSelectWeather] = useState(0);

  useEffect(() => {
    let weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let forecastData = [];
    for (let i = 0; i < weatherForecastData.length; i++) {
      forecastData.push(weatherForecastData[i][0]);
    }
    for (let i = 0; i < forecastData.length; i++) {
      let date = new Date(forecastData[i].dt * 1000);
      let day = date.getDay();
      forecastData[i].day = weekDays[day].substring(0, 3);
    }
    setWeather(forecastData);

    if (forecastData[0]?.date && forecastData[0].main) {
      onSelectWeather(
        forecastData[0].date,
        forecastData[0].main,
        forecastData[0].weather
      );
    }
  }, [weatherForecastData, onSelectWeather]);

  const selectForcastHandler = (date, temp, index, weather) => {
    setSelectWeather(index);
    onSelectWeather(date, temp, weather);
  };

  return (
    <div className="weather">
      {weather.map((weather, index) => (
        <div
          key={index}
          className={`weather_icons ${selectweather === index && "active"}`}
          onClick={() =>
            selectForcastHandler(
              weather.date,
              weather.main,
              index,
              weather.weather
            )
          }
        >
          <div style={{ textAlign: "center" }}>
            <h5 className="weather_day">
              <strong>{weather.day}</strong>
            </h5>
          </div>
          <div className="weather_temp">
            <span>
              <span style={{ verticalAlign: "sub" }}>
                <strong> {Math.round(weather.main.temp_max - 273)}</strong>
              </span>
              <span style={{ verticalAlign: "super" }}>
                <strong>.</strong>
              </span>
            </span>
            <span style={{ color: "grey" }}>
              <span style={{ verticalAlign: "sub" }}>
                <strong> {Math.round(weather.main.temp_min - 273)}</strong>
              </span>
              <span style={{ verticalAlign: "super" }}>
                <strong>.</strong>
              </span>
            </span>
          </div>
          <div className="weather_icons">
            <img
              className="weather_icon"
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
            />
          </div>
          <div className="weather_name">
            <h6 className="weather_Name">
              <strong>{weather.weather[0].main}</strong>
            </h6>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Weather;
