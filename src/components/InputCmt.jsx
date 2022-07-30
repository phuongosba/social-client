import { Avatar, Button, makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
const useStyles = makeStyles((theme) => ({
  form_cmt: {
    backgroundColor: "#e0e0e0",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#eceff1",
    },
    width: "90%",
    marginLeft: "1rem",
  },
  input_cmt: {
    backgroundColor: "transparent",
    width: "89%",
    padding: "5px",
    borderRadius: "16px",
    display: "flex",
    color: "black",
  },
  inputContainer: {
    margin: "10px 0",
    display: "flex",
    justifyContent: "flex-start",
  },
  button_cmt: {
    borderRadius: "16px",
    backgroundColor: "#757575",

    color: "white",
    fontWeight: "600",
    "&:hover": { backgroundColor: "#18478b" },
  },
}));
export default function InputCmt({ idPost, addCmts }) {
  const classes = useStyles();
  const URL = process.env.REACT_APP_API_URL;
  const { user, token } = useContext(AuthContext);

  const desc = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (desc.current.value === "") {
      return null;
    }
    const newCmt = {
      userId: user._id,
      postId: idPost,
      content: desc.current.value,
      img: "",
    };
    try {
      await axios.post(`${URL}/api/comments/`, newCmt, {
        headers: { "x-access-token": token },
      });
      addCmts(newCmt);
      desc.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.inputContainer}>
      <Avatar alt="" src={user.profilePicture} className={classes.image} />

      <form className={classes.form_cmt}>
        <input
          type="text"
          placeholder="bình luận..."
          className={classes.input_cmt}
          ref={desc}
        />
        <Button className={classes.button_cmt} onClick={handleSubmit}>
          Đăng
        </Button>
      </form>
    </div>
  );
}
