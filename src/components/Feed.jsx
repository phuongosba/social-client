import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Container, makeStyles } from "@material-ui/core";
import Share from "./Share";
import Post from "./Post";
import { AuthContext } from "../Context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "../css/Rightbar.css";
const useStyles = makeStyles((theme) => ({
  feedWrapper: {},
}));

export default function Feed({ userId }) {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const { token, user } = useContext(AuthContext);
  const URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    //clean up useEffect with axios
    const ourRequest = axios.CancelToken.source(); //1st step

    const fetchPosts = async () => {
      try {
        const res = userId
          ? await axios.get(
              `${URL}/api/posts/profile/${userId}?page=1`,
              {
                headers: { "x-access-token": token },
              },
              {
                cancelToken: ourRequest.token, //2nd step
              }
            )
          : await axios.get(
              `${URL}/api/posts/timeline?page=1`,
              {
                headers: { "x-access-token": token },
              },
              {
                cancelToken: ourRequest.token,
              }
            );
        const postData = res.data;

        setPosts(postData);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Requet cancel", err.message);
        }

        if (err.response.status === 401) {
          localStorage.removeItem("user");

          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    };

    fetchPosts();

    return () => {
      ourRequest.cancel("cancel by user"); //3rd step
    };
  }, [userId, user._id, posts.length]);

  let [page, setPage] = useState(2);
  const [noMore, setNoMore] = useState(true);
  const fetchPosts2 = async () => {
    const res = userId
      ? await axios.get(`${URL}/api/posts/profile/${userId}?page=${page}`, {
          headers: { "x-access-token": token },
        })
      : await axios.get(`${URL}/api/posts/timeline?page=${page}`, {
          headers: { "x-access-token": token },
        });
    const postData2 = res.data;

    return postData2;
  };
  const fetchMoreData = async () => {
    const next_postdata = await fetchPosts2();
    setPosts([...posts, ...next_postdata]);
    if (next_postdata.length === 0 || next_postdata < 10) {
      setNoMore(false);
    }
    setPage(page + 1);
  };
  const Delete_Posts = async (id) => {
    try {
      const data = {
        userId: user._id,
      };

      await axios.delete(
        `${URL}/api/posts/${id}`,
        { data },
        {
          headers: { "x-access-token": token },
        }
      );

      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="feed">
      <div className={classes.feedWrapper}>
        {(!userId || userId === user._id) && (
          <Share addPost={(post) => setPosts([...posts, post])} />
        )}
        <div>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={noMore}
            loader={<h4>Loading...</h4>}
            style={{ padding: "1px", paddingBottom: "10px" }}
            endMessage={
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  padding: "10px",
                  borderRadius: "16px",
                  background: "#647dd7",

                  color: "white",
                }}
              >
                Đã xem hết tât!!!
              </p>
            }
          >
            {posts.map((p) => (
              <Post
                key={p._id}
                post={p}
                delete_post={(id) => Delete_Posts(id)}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </Container>
  );
}
