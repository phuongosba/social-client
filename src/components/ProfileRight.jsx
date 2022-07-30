import React, { useEffect, useState, useContext, useRef } from "react";
import "../css/ProfileRight.css";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { CircularProgress } from "@mui/material";
export default function ProfileRight({ user, changeUser }) {
  const [friends, setFriends] = useState([]);
  const { token, user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user._id)
  );
  const URL_API = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const editName = useRef();
  const editCity = useRef();

  //edit info modal
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const Edit_info = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let name_edit = "";
      let city_edit = "";
      if (editName.current.value === "") {
        name_edit = currentUser.name;
      } else {
        name_edit = editName.current.value;
      }

      if (editCity.current.value === "") {
        city_edit = currentUser.city;
      } else {
        city_edit = editCity.current.value;
      }
      const newInfo = {
        name: name_edit,
        city: city_edit,
        faculty: editFac,
      };

      await axios.put(
        `${URL_API}/api/users/${currentUser._id}`,

        newInfo,
        { headers: { "x-access-token": token } }
      );

      await dispatch({ type: "EDIT_INFO", payload: newInfo });
      const res = await axios.get(`${URL_API}/api/users/${currentUser._id}`, {
        headers: { "x-access-token": token },
      });
      changeUser(res.data);
      setLoading(false);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const [faculties, setFaculties] = useState([]);
  const fetchFaculty = async () => {
    try {
      const res = await axios.get(`${URL_API}/api/admin/faculties`);
      const data = res.data;
      setFaculties(data);
    } catch (err) {
      console.log("Requet cancel", err.message);
    }
  };
  const [userFac, setUserFac] = useState("");
  const getFacName = async () => {
    try {
      if (user.faculty) {
        const res = await axios.get(
          `${URL_API}/api/admin/faculties/${user.faculty}`
        );
        const data = res.data;
        setUserFac(data);
      }
    } catch (err) {
      console.log("Requet cancel", err.message);
    }
  };
  useEffect(() => {
    fetchFaculty();
    getFacName();
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${URL_API}/api/users/friends/${user._id}`,
          {
            headers: { "x-access-token": token },
          }
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);
  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`${URL_API}/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`${URL_API}/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };
  //get Faculty

  const [editFac, setEditFac] = useState(user.faculty);
  const handleChange = (event) => {
    setEditFac(event.target.value);
  };

  return (
    <div>
      {user._id !== currentUser._id && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <PersonRemoveIcon /> : <PersonAddAlt1Icon />}
        </button>
      )}
      {user.authorize === 3 && (
        <div className="rightbarInfoContainer">
          <h4 className="rightbarTitle">
            Thông tin
            {user._id === currentUser._id ? (
              <CreateIcon className="rightbarIcon" onClick={handleClickOpen} />
            ) : (
              <></>
            )}
          </h4>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="form_update_header">
              Sửa thông tin
            </DialogTitle>

            {loading ? (
              <DialogContent className="loadingProgress">
                <CircularProgress color="inherit" />
              </DialogContent>
            ) : (
              <DialogContent>
                <form className="form_update_info">
                  <div className="form_update_info-item">
                    <label htmlFor="fname" className="form_update_info-label">
                      Tên hiển thị:
                    </label>
                    <input
                      aria-label=""
                      className="form_update_info-input"
                      defaultValue={currentUser.name}
                      ref={editName}
                    />
                  </div>

                  <div className="form_update_info-item">
                    <label
                      className="form_update_info-label"
                      id="demo-simple-select-label"
                    >
                      Khoa:
                    </label>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={editFac}
                      label="Khoa"
                      onChange={handleChange}
                      className="form_update_info-input"
                    >
                      {faculties.map((fac) => (
                        <MenuItem key={fac._id} value={fac._id}>
                          {fac.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div className="form_update_info-item">
                    <label htmlFor="city" className="form_update_info-label">
                      Thành phố:
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form_update_info-input"
                      defaultValue={currentUser.city}
                      ref={editCity}
                    />
                  </div>
                </form>
              </DialogContent>
            )}

            <DialogActions>
              <Button onClick={handleClose} className="button_cancel">
                Hủy
              </Button>
              <Button onClick={(e) => Edit_info(e)} className="button_edit">
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
          <div className="rightbarInfo">
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">Khoa:</span>
              <span className="rightbarInfoValue">{userFac}</span>
            </div>

            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">Thành phố:</span>
              <span className="rightbarInfoValue">{user.city}</span>
            </div>
          </div>
        </div>
      )}

      <div className="rightbarFollowingsContainer">
        <h4 className="rightbarTitle">Quan tâm</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link key={friend._id} to={`/profile/${friend.username}`}>
              <div className="rightbarFollowing">
                <img
                  alt=""
                  src={friend.profilePicture}
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
