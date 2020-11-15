import React, { useEffect, useState } from "react";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./DisplayContent.scss";

function DisplayContent({
  weatherForecastData,
  date,
  temp,
  pressure,
  humidity,
  city,
  icon,
}) {
  const [data, setData] = useState([]);
  const [sungraphData, setSunGraphData] = useState([]);

  useEffect(() => {
    let data = weatherForecastData.filter((e) => e.date === date);
    let array = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      let d = new Date(data[i].dt * 1000);
      let hour = d.getHours();
      if (hour < 12) {
        obj.time = hour + "am";
      } else {
        let time = hour % 12;
        if (time === 0) {
          obj.time = 12 + "pm";
        } else {
          obj.time = (hour % 12) + "pm";
        }
      }
      obj.temp = Math.round(data[i].main.temp - 273);
      array.push(obj);
    }

    let sundata = [];
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        let City = {};
        let sunrise = new Date(city.sunrise * 1000);
        let sunriseHour =
          sunrise.getHours().toString() + ":" + sunrise.getMinutes().toString();
        City.sun = sunriseHour + "am";
        City.difference = 0;
        sundata.push(City);
      }
      if (i === 1) {
        let City = {};
        City.sun = 9 + "am";
        City.difference = 2;
        sundata.push(City);
      }
      if (i === 2) {
        let City = {};
        let sunrise = new Date(city.sunrise * 1000);
        let sunriseHour = sunrise.getHours().toString();
        let sunset = new Date(city.sunset * 1000);
        let sunseteHour = sunset.getHours().toString();
        City.sun = 11 + "am";
        City.difference = sunseteHour - sunriseHour;
        sundata.push(City);
      }
      if (i === 3) {
        let City = {};
        let sunset = new Date(city.sunset * 1000);
        let sunseteHour = sunset.getHours().toString();
        let sunseteMin = sunset.getMinutes().toString();
        if (sunseteHour > 12) {
          if (sunseteHour % 12 === 0) {
            City.sun = 12 + "am";
          } else {
            City.sun = (sunseteHour % 12) + ":" + sunseteMin + "pm";
          }
        }
        City.difference = 0;
        sundata.push(City);
      }
      setSunGraphData(sundata);
    }

    setData(array);
  }, [weatherForecastData, date, temp, city]);

  return (
    <div className="shadow mb-5 bg-white rounded mt-5">
      {weatherForecastData.length > 0 ? (
        <div>
          <div className="temp container my-4">
            {temp ? (
              <div style={{ display: "flex" }}>
                <h1>
                  <span style={{ verticalAlign: "sub" }}>
                    <strong>{Math.round(temp - 273)}</strong>
                  </span>
                  <span style={{ verticalAlign: "super" }}>.</span>
                  <span style={{ verticalAlign: "sub" }}>
                    <strong>C</strong>
                  </span>
                </h1>
                <img
                  src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt=""
                />
              </div>
            ) : null}
          </div>
          <div style={{ textAlign: "center" }} className="display_chart">
            <LineChart
              style={{ width: "100%" }}
              width={650}
              height={250}
              data={data}
              margin={{
                top: 5,
                left: 0,
                right: 15,
                bottom: 5,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis dataKey="time" />
              <YAxis tick={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#7ac2e6"
                strokeWidth="3"

                // activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
          <div className="display_conditions container my-5">
            <div className="display_humidity">
              <h5>
                <strong>Humidity</strong>
              </h5>
              <h5>
                <strong>{humidity + " "}%</strong>
              </h5>
            </div>
            <div className="display_pressure">
              <h5>
                <strong>Pressure</strong>
              </h5>
              <h5>
                <strong>{pressure + " "}hpa</strong>
              </h5>
            </div>
          </div>
          <div className="sundatachart" style={{ textAlign: "center" }}>
            <AreaChart
              style={{ width: "10%" }}
              width={650}
              height={200}
              data={sungraphData}
              margin={{
                top: 10,
                right: 15,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis dataKey="sun" />
              <YAxis tick={false} axisLine={false} />
              <Area
                type="monotone"
                dataKey="difference"
                stroke="#ffd6ab"
                fill="#ffd6ab"
              />
            </AreaChart>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DisplayContent;
