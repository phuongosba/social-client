import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import "./CateNoti.css";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export default function CateNoti() {
  const [notis, setNotis] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [categories, setCategories] = useState([]);
  const URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/api/admin/categories`);
        const data = res.data;
        setNotis(data);
        let arr = [];
        data.map((noti) => {
          if (noti.name.toUpperCase().slice(0, 4).includes("KHOA")) {
            arr.push(noti);
          }
        });
        setFaculties(arr);
        setCategories(data.filter((x) => !arr.includes(x)));
      } catch (err) {
        console.log("Requet cancel", err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Khoa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="cateItemsList">
            {faculties.map((cate) => (
              <li key={cate._id} className="cateItem">
                <Link to={`/notification/${cate.slug}`}>
                  <Typography className="cateName">{cate.name}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Chuyên mục</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="cateItemsList">
            {categories.map((cate) => (
              <li key={cate._id} className="cateItem">
                <Link to={`/notification/${cate.slug}`}>
                  <Typography className="cateName">{cate.name}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
