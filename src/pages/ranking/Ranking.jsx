import React, { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavBar from "../../components/navbar/NavBar.jsx";
import "./ranking.scss";
import { DarkModeContext } from "../../context/darkModeContext.js";
import { useContext } from "react";
import avata from "./avata.jpg";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import * as Itemserver from "../../server/itemstore.js";

const Ranking = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [selectedWeek, setSelectedWeek] = useState(47);
  const [selectedQuantity, setSelectedQuantity] = useState(5);
  const [data, setData] = useState([]);
  const [top1Data, setTop1Data] = useState(null);

  useEffect(() => {
    // Simulate fetching data from API
    const fetchData = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        // Replace the URL with your actual API endpoint
        const response = await Itemserver.getTopUser(selectedWeek, accessToken);
        const result = response.listData;
        setData(result); // Assuming the API returns an array of data
        console.log('setTop1Data', result[0].username )

        if (result.length > 0) {
          setTop1Data(result[0]);
          
        } else {
          setTop1Data(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedWeek]); // Fetch data when selectedWeek changes

  const rows = data.map((item, index) => ({ ...item, top: index + 1 }));

  const handleChangeWeek = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleChangeQuantity = (event) => {
    setSelectedQuantity(event.target.value);
  };

  const columns = [
    {
      field: "top",
      headerName: "Top",
      width: 150,
      renderCell: (params) => `Top ${params.row.top}`,
    },
    { field: "username", headerName: "Username", width: 150 },
    { field: "avg_star", headerName: "Average Star", width: 150 },
    { field: "post_count", headerName: "Post Count", width: 150 },
  ];

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <div className="ranking">
        <NavBar />
        <h1 className="top_rank"> TOP RANKING IN WEEK</h1>
        <div className="container">
          <div className="left-container">
            <div className="select-row-container">
              {/* Week Select */}
              <FormControl style={{ width: "100px" }}>
                <InputLabel id="week-select-label">Select Week</InputLabel>
                <Select
                  labelId="week-select-label"
                  id="week-select"
                  value={selectedWeek}
                  onChange={handleChangeWeek}
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                  }}
                >
                  {[...Array(52).keys()].map((week) => (
                    <MenuItem key={week + 1} value={week + 1}>
                      {week + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quantity Select */}
              <FormControl style={{ width: "150px", marginLeft: "20px" }}>
                <InputLabel id="quantity-select-label">
                  Select Quantity
                </InputLabel>
                <Select
                  labelId="quantity-select-label"
                  id="quantity-select"
                  value={selectedQuantity}
                  onChange={handleChangeQuantity}
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                  }}
                >
                  {[5, 10, 15, 20].map((quantity) => (
                    <MenuItem key={quantity} value={quantity}>
                      {quantity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <DataGrid rows={rows} columns={columns} />
          </div>
          <div className="right-container">
              {top1Data && (
                <div className="profile">
                  <h2>{`Top 1 in week ${selectedWeek}`}</h2>
                  <img src={`http://localhost:3500/${top1Data.profilePic}`} alt="Profile" />
                  <h3 className="h3_profile">{top1Data.username}</h3>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="star">
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Ranking;
