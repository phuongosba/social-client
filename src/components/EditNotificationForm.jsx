import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import NativeSelect from "@mui/material/NativeSelect";
export default function EditNotificationForm({
  openEdit,
  handleCloseEdit,
  Transition,
  notification,
  notifications,
  token,
  setAlert,
  setAlertContent,
  setAlertType,
  categories,
}) {
  const [title, setTitle] = useState(`${notification.title}`);
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(`${notification.categoryId}`);
  const formControl = {
    width: "100%",
    marginBottom: "20px",
  };
  const URL = process.env.REACT_APP_API_URL;
  const handleSubmitEditNotification = async (e) => {
    const editedNotification = {
      title,
      content,
      categoryId,
    };
    if (
      !title ||
      title.length === 0 ||
      !content ||
      content.length === 0 ||
      !categoryId ||
      categoryId.length === 0
    ) {
      handleCloseEdit();
      setAlertType("error");
      setAlertContent("Vui lòng nhập đầy đủ thông tin");
      setAlert(true);
    } else {
      let res = await axios.put(
        `${URL}/api/falcuty/notifications/${notification._id}`,
        editedNotification,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (res.data.code === 0 || res.data.code === -1) {
        setAlertType("error");
      } else if (res.data.code === 1) {
        setAlertType("success");
      }
      let updateNoti = await notifications.find(
        (e) => e._id === notification._id
      );
      let cate = categories.find((c) => c._id === categoryId);
      updateNoti.title = title;
      updateNoti.content = content;
      updateNoti.categoryId = categoryId;
      updateNoti.category[0].name = cate.name;
      handleCloseEdit();
      setTimeout(() => {
        setAlert(false);
        setAlertContent("");
      }, 4000);
      setAlert(true);
      setAlertContent(res.data.message);
    }
  };

  useEffect(() => {
    setTitle(notification.title);
    setContent(notification.content);
    setCategoryId(notification.categoryId);
  }, [notification]);

  return (
    <Dialog
      open={openEdit}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseEdit}
      aria-describedby="alert-dialog-slide-description-edit-notifi"
    >
      <DialogTitle className="text-center">Chỉnh sửa thông báo</DialogTitle>
      <DialogContent>
        <DialogContentText
          className="mt-3"
          id="alert-dialog-slide-description-edit-notifi"
        >
          <FormControl style={formControl}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Chuyên mục
            </InputLabel>
            <NativeSelect
              defaultValue={notification.categoryId}
              inputProps={{
                name: "Chuyên mục",
                id: "uncontrolled-native",
              }}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((e) => (
                <option value={e._id}>{e.name}</option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl style={formControl}>
            <TextField
              id="filled-basic"
              label="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl style={formControl}>
            <label className="form-label">Nội dung</label>
            <div>
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
              />
            </div>
          </FormControl>
          <div className="text-center"></div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="btn btn-secondary" onClick={handleCloseEdit}>
          Hủy
        </button>
        <button
          onClick={handleSubmitEditNotification}
          className="text-center btn btn-success"
        >
          Xác nhận
        </button>
      </DialogActions>
    </Dialog>
  );
}
