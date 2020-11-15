import React, { useState } from "react";
import { AutoComplete } from "antd";
import "./Search.scss";
import citiesData from "../cities.json";

function Search({ onSelect, state }) {
  const [options, setOptions] = useState([]);
  // useEffect(() => {}, []);

  const onchangeHandler = (placeName) => {
    let array = [];
    for (var i = 0; i < citiesData.length; i++) {
      let data = {};
      data.id = citiesData[i].id;
      data.value = `${citiesData[i].city},${citiesData[i].state}`;
      array.push(data);
      setOptions(array);
    }
  };
  return (
    <div>
      <div className="searchbar shadow mb-4 bg-white rounded mt-5">
        <AutoComplete
          className="autocomplete_search"
          defaultValue={state}
          onSelect={(value, option) => onSelect(value, option)}
          onChange={onchangeHandler}
          options={options}
          // placeholder="try to type `b`"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </div>
    </div>
  );
}

export default Search;
