import React, { Component } from "react";
import axios from "axios";
import Search from "./Component/Search";
import "antd/dist/antd.css";
import "./App.css";
import Weather from "./Component/Weather";
import DisplayContent from "./Component/DisplayContent";

export class App extends Component {
  constructor(props) {
    super(props);
    this.letitude = "";
  }

  state = {
    weatherForecastData: [],
    dateSortedData: [],
    date: "",
    temp: "",
    humidity: "",
    pressure: "",
    city: {},
    letitude: "",
    longitude: "",
    state: "",
    icon: "",
    weather: [],
  };

  async componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (position.coords.latitude && position.coords.longitude) {
          let city = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          this.setState({
            state: city.data.principalSubdivision,
          });
          let forecastData;
          try {
            forecastData = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast?q=${city.data.principalSubdivision.toLowerCase()},India&appid=2a41d0f02bd607a09a62a8c93f374693`
            );
          } catch (e) {
            setTimeout(() => {
              alert("sorry could'nt find your city data");
            }, 1000);
          }

          if (forecastData?.data?.list) {
            let forecastDates = [];
            let weatherData = JSON.parse(
              JSON.stringify(forecastData.data.list)
            );
            for (let i = 0; i < weatherData.length; i++) {
              let d = new Date(weatherData[i].dt * 1000);
              // we can also make function for date conversion
              let date =
                d.getDate().toString() +
                "-" +
                d.getMonth().toString() +
                "-" +
                d.getFullYear().toString();
              weatherData[i].date = date;
              forecastDates.push(date);
            }
            let uniqueForecastDate = forecastDates.filter((c, index) => {
              return forecastDates.indexOf(c) === index;
            });
            let datesSortedData = [];
            for (let i = 0; i < uniqueForecastDate.length; i++) {
              let array = weatherData.filter(
                (date) => date.date === uniqueForecastDate[i]
              );
              datesSortedData.push(array);
            }
            await this.setState({
              weatherForecastData: JSON.parse(JSON.stringify(weatherData)),
              dateSortedData: JSON.parse(JSON.stringify(datesSortedData)),
              city: JSON.parse(JSON.stringify(forecastData.data.city)),
            });
          }
        }
      });
    }
  }

  onSelect = async (city) => {
    let forecastData = [];
    try {
      forecastData = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},India&appid=2a41d0f02bd607a09a62a8c93f374693`
      );
    } catch (e) {
      await this.setState({
        weatherForecastData: [],
        dateSortedData: [],
        city: "",
      });
      setTimeout(() => {
        alert("sorry could'nt find your city data");
      }, 1000);
    }

    if (forecastData?.data?.list) {
      let forecastDates = [];
      let weatherData = JSON.parse(JSON.stringify(forecastData.data.list));
      for (let i = 0; i < weatherData.length; i++) {
        let d = new Date(weatherData[i].dt * 1000);
        // we can also make function for date conversion
        let date =
          d.getDate().toString() +
          "-" +
          d.getMonth().toString() +
          "-" +
          d.getFullYear().toString();
        weatherData[i].date = date;
        forecastDates.push(date);
      }
      let uniqueForecastDate = forecastDates.filter((c, index) => {
        return forecastDates.indexOf(c) === index;
      });
      let datesSortedData = [];
      for (let i = 0; i < uniqueForecastDate.length; i++) {
        let array = weatherData.filter(
          (date) => date.date === uniqueForecastDate[i]
        );
        datesSortedData.push(array);
      }
      await this.setState({
        weatherForecastData: JSON.parse(JSON.stringify(weatherData)),
        dateSortedData: JSON.parse(JSON.stringify(datesSortedData)),
        city: JSON.parse(JSON.stringify(forecastData.data.city)),
      });
    }
  };

  onSelectWeather = async (date, main, weather) => {
    await this.setState({
      date: date,
      temp: main.temp,
      humidity: main.humidity,
      pressure: main.pressure,
      icon: weather[0].icon,
    });
  };

  render() {
    return (
      <div className="app">
        <div className="app_content">
          <Search onSelect={this.onSelect} state={this.state.state} />
          <Weather
            weatherForecastData={this.state.dateSortedData}
            onSelectWeather={this.onSelectWeather}
          />
          <DisplayContent
            weatherForecastData={this.state.weatherForecastData}
            date={this.state.date}
            temp={this.state.temp}
            humidity={this.state.humidity}
            pressure={this.state.pressure}
            city={this.state.city}
            icon={this.state.icon}
          />
        </div>
      </div>
    );
  }
}

export default App;
