import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";
import "moment/locale/vi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import EditNotificationDialog from "./EditNotificationForm";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotificationTable() {
  moment.locale("vi");
  const URL = process.env.REACT_APP_API_URL;
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [alertType, setAlertType] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const { token, user } = useContext(AuthContext);
  const [notificationId, setNotificationId] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [notification, setNotification] = useState({});
  const [search, setSearch] = useState("");
  //Mở dialog form chỉnh sửa thông báo
  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  //Mở dialog xóa thông báo
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  //Xử lí xóa thông báo
  const handleDeleteNotification = async () => {
    try {
      const res = await axios.delete(
        `${URL}/api/falcuty/notifications/${notificationId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      handleCloseDelete();
      let refreshNotifications = await notifications.filter(
        (not) => not._id !== notificationId
      );
      setNotifications(refreshNotifications);
      setDisplayedNotifications(refreshNotifications);
      setAlert(true);
      setAlertContent(res.data);
      setAlertType("success");
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request cancel", err.message);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${URL}/api/falcuty/notifications`, {
        headers: { Authorization: "Bearer " + token },
      });

      setNotifications(res.data);
      setDisplayedNotifications(res.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request cancel", err.message);
      }
    }
  };

  const fectchCategories = async () => {
    try {
      let res = await axios.get(`${URL}/api/falcuty/categories`, {
        headers: { Authorization: "Bearer " + token },
      });
      let unSelectedCategory = res.data.filter(
        (e) => e._id !== notification.categoryId
      );
      setCategories(unSelectedCategory);
    } catch (error) {}
  };
  useEffect(() => {
    fetchNotifications();
    fectchCategories();
  }, []);

  function filterResults(list, category) {
    if (category === "all") {
      return list;
    } else {
      return list.filter((x) => x.categoryId === category);
    }
  }

  useEffect(() => {
    let newNotifications = filterResults(notifications, category);
    setDisplayedNotifications(newNotifications);
  }, [category]);

  return (
    <>
      <div className="container">
        {alert ? (
          <Alert className="mt-1 mb-1" severity={alertType} in={alert}>
            {alertContent}
          </Alert>
        ) : (
          <></>
        )}
        <div className="row mb-4">
          <div className="col-12 col-md-6">
            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Chuyên mục
              </InputLabel>
              <NativeSelect
                defaultValue={"all"}
                inputProps={{
                  name: "category",
                  id: "uncontrolled-native",
                }}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="all">Tất cả</option>
                {categories.map((cate) => (
                  <option value={cate._id}>{cate.name}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tiêu đề</th>
              <th>Chuyên mục</th>
              <th>Ngày đăng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedNotifications.length > 1 ? (
              displayedNotifications.map((notification, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{notification.title}</td>
                  <td>{notification.category[0].name}</td>
                  <td>{moment(notification.createdAt).format("lll")}</td>
                  <td>
                    <button>
                      <EditIcon
                        onClick={() => {
                          handleClickOpenEdit();
                          setNotification(notification);
                        }}
                      />
                      <DeleteIcon
                        onClick={() => {
                          handleClickOpenDelete();
                          setNotificationId(notification._id);
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div className="text-center">
                Chưa có thông báo cho chuyên mục này
              </div>
            )}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Xóa thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn có chắc muốn xóa thông báo này không ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn btn-secondary" onClick={handleCloseDelete}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={handleDeleteNotification}>
            Xác nhận
          </button>
        </DialogActions>
      </Dialog>
      <EditNotificationDialog
        openEdit={openEdit}
        handleCloseEdit={handleCloseEdit}
        Transition={Transition}
        notification={notification}
        notifications={notifications}
        token={token}
        setAlert={setAlert}
        setAlertContent={setAlertContent}
        setAlertType={setAlertType}
        categories={categories}
      ></EditNotificationDialog>
    </>
  );
}
