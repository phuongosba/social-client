import React, { useContext } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/AuthContext";
import ErrorPage from "../components/ErrorPage";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MangeUser from "../components/MangeUser";

import ManageCate from "../components/ManageCate";
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
export default function Dashboard() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      {user.authorize !== 1 ? (
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
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Khoa" value="1" />

                      <Tab label="Danh mục" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <MangeUser />
                  </TabPanel>

                  <TabPanel value="2">
                    <ManageCate />
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
