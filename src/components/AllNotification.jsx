import React, { useState, useEffect, useContext, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@material-ui/core";
import "./ListNotis/ListNotis.css";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import parse from "html-react-parser";
import ItemListNotification from "./ItemListNotification";
export default function AllNotification() {
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [cateName, setCateName] = useState("");
  const [pages, setPages] = useState("");
  const [searchText, setSearchText] = useState("");
  const URL = process.env.REACT_APP_API_URL;
  const fetchNotifications = async (page) => {
    try {
      const res = await axios.get(
        `${URL}/api/notifications/getAll?page=${page}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setNotifications(res.data.result);

      setPages(Math.ceil(res.data.len / 10));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);
  return (
    <div>
      <div className="category-name blue ">
        <span>
          <Link className="link-text" to="/notification">
            Tất cả thông báo
          </Link>
        </span>
      </div>

      <div className="ListContainer">
        <ul className="list-container">
          {notifications.map((noti) => (
            <li key={noti._id} className="item-notification">
              <ItemListNotification noti={noti} category={noti.categoryId} />
            </li>
          ))}
        </ul>
        <Stack spacing={2}>
          <Typography>Trang: {page}</Typography>
          <Pagination count={pages} page={page} onChange={handleChange} />
        </Stack>
      </div>
    </div>
  );
}
