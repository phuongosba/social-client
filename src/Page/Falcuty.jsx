import NotificationTable from "../components/NotificationTable";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/AuthContext";
import ErrorPage from "../components/ErrorPage";
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.between("xs", "sm")]: {
      display: "none",
    },
  },
  contentpad: {
    paddingTop: theme.spacing(10),
  },
}));
export default function Falcuty() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user.authorize !== 2 ? (
        <div>
          <Navbar />
          <Grid container>
            <ErrorPage string={"Trang này không tồn tại"} />
          </Grid>
        </div>
      ) : (
        <>
          <Navbar />
          <Grid container>
            <Grid item md={2} className={classes.right}>
              <Leftbar />
            </Grid>
            <Grid item sm={12} md={10} xs={12} className={classes.contentpad}>
              <Link
                to="/falcuty/notification/add"
                className="btn btn-success mb-3 mt-3 ml-3"
              >
                Tạo thông báo
              </Link>
              <NotificationTable />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
