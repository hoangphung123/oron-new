import React, { useState, useEffect } from "react";
import "./rankingNew.scss"; // Tạo và import file SCSS này để áp dụng style
import Ranking1 from "./3da1c204207bec1124d5a7c8f94534-unscreen.gif";
import Ranking2 from "./pngwing.png";
import Ranking3 from "./pngwing2.png";
import { DarkModeContext } from "../../context/darkModeContext.js";
import { useContext } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import * as Itemserver from "../../server/itemstore.js";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Table } from "antd";

const datas = [
  {
    position: 1,
    name: "Phung Huy Hoang",
    rating: 5,
    imageUrl:
      "https://i.pinimg.com/564x/da/52/81/da52815da1578cbe48e9bf62145374b6.jpg",
  },
  {
    position: 2,
    name: "Xuan Loc Nguyen",
    rating: 5,
    imageUrl:
      "https://i.pinimg.com/564x/da/52/81/da52815da1578cbe48e9bf62145374b6.jpg",
  },
  {
    position: 3,
    name: "Nguyen Dinh Thinh",
    rating: 5,
    imageUrl:
      "https://i.pinimg.com/564x/da/52/81/da52815da1578cbe48e9bf62145374b6.jpg",
  },
  {
    position: 4,
    name: "Xuan ",
    rating: 5,
    imageUrl:
      "https://i.pinimg.com/564x/da/52/81/da52815da1578cbe48e9bf62145374b6.jpg",
  },
  // Add more user data as needed
];

const RankingNew = () => {
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
        console.log("setTop1Data", result[0].username);

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
      title: "Top",
      dataIndex: "top",
      key: "top",
      render: (text, record, index) => {
        if (index === 0) return <span className="ranking-medal">🥇</span>;
        if (index === 1) return <span className="ranking-medal">🥈</span>;
        if (index === 2) return <span className="ranking-medal">🥉</span>;
        return `Top ${index + 1}`;
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Average Star",
      dataIndex: "avg_star",
      key: "avg_star",
    },
    {
      title: "Post Count",
      dataIndex: "post_count",
      key: "post_count",
    },
  ];

  // const reorderedData = [datas[1], datas[0], data[2]];
  const updatedData = [...data]; // Tạo bản sao của mảng gốc để không làm thay đổi mảng `data`
  if (updatedData.length >= 2) {
    // Hoán đổi phần tử tại index 0 và index 1
    [updatedData[0], updatedData[1]] = [updatedData[1], updatedData[0]];
  }
  return (
    <div className="ranking-container">
      <div className="ranking-content">
        <h2>Ranking</h2>
        <div className="top-ranking">
          {data.slice(0, 3).map((user, index) => {
            // Xác định class cho từng vị trí Top
            let topClass = "top-3"; // Mặc định cho vị trí 3
            if (updatedData.length === 1) {
              topClass = "top-2"; // Chỉ có 1 phần tử, gán top-2
            } else if (updatedData.length === 2) {
              topClass = index === 0 ? "top-1" : "top-2"; // 2 phần tử, gán top-1, top-2
            } else if (updatedData.length >= 3) {
              topClass =
                index === 0 ? "top-1" : index === 1 ? "top-2" : "top-3"; // 3 phần tử, gán top-1, top-2, top-3
            }

            return (
              <div key={index} className={`top-user ${topClass}`}>
                {/* Hình ảnh huy chương */}
                {updatedData.length === 1 ? (
                  <img
                    src={Ranking1}
                    alt="Ranking Decoration"
                    className="ranking-decoration"
                  />
                ) : index === 0 ? (
                  <img
                    src={Ranking3}
                    alt="Ranking Decoration"
                    className="ranking-decoration1"
                  />
                ) : index === 1 ? (
                  <img
                    src={Ranking1}
                    alt="Ranking Decoration"
                    className="ranking-decoration"
                  />
                ) : index === 2 ? (
                  <img
                    src={Ranking2}
                    alt="Ranking Decoration"
                    className="ranking-decoration2"
                  />
                ) : null}
                {/* Hình ảnh người dùng */}
                <div className="img-container">
                  <img
                    src={`http://localhost:3500/${user.profilePic}`}
                    alt={user.username}
                    className="user-image"
                  />
                </div>
                {/* Tên người dùng và đánh giá */}
                <p className="user-name">
                  {user.username} {user.avg_star}{" "}
                  <span className="star">★</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* <table className="ranking-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>User Name</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td>
                  {user.position === 1
                    ? "🥇"
                    : user.position === 2
                    ? "🥈"
                    : user.position === 3
                    ? "🥉"
                    : user.position}
                </td>
                <td>
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="table-user-image"
                  />
                  {user.name}
                </td>
                <td>
                  {user.rating} <span className="star">★</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>...</button>
          <button>6</button>
        </div> */}
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
          <Table columns={columns} dataSource={rows} />
        </div>
      </div>
    </div>
  );
};

export default RankingNew;
