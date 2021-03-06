import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Editor from "for-editor";
import Navbar from "../components/Navbar";
import LoadingMask from "../LoadingMask";
import styled from "styled-components";
import { saveToLocal } from "../apis/postApi";
import "../css/editor.scss";
import io from "socket.io-client";
import { API_ENDPOINT } from "../constant/constant";
import DiffMatchPatch from "diff-match-patch";

const ENDPOINT = API_ENDPOINT;
const toolbar = {
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  img: true,
  link: true,
  code: true,
  preview: true,
  expand: false,
  undo: false,
  redo: false,
  save: false,
  subfield: true,
};

const Container = styled.div`
  display: flex;
  flex-flow: column-reverse;
`;

const EditorContainer = styled.div``;

const placeholder = "# Put your note title here";

const SocketPage = () => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState(1);
  const dispatch = useDispatch();

  // get current user id
  const currentUser = useSelector((state) => state.user);
  const currentUserId = currentUser?.user?.id;

  // socket, create room id
  let { id } = useParams();
  const postId = Number(id);

  const [input, setInput] = useState();
  // const prevInputRef = useRef();
  const prevSocketRef = useRef();

  const getCaretPostion = () => {
    const myElement = document.querySelector("textarea");
    let startPosition = myElement.selectionStart;
    localStorage.setItem("caret", startPosition);
  };

  const setCaretPostion = () => {
    const myElement = document.querySelector("textarea");
    myElement.focus();
    let caret = localStorage.getItem("caret");
    caret = caret ? Number(caret) : null;
    myElement.setSelectionRange(caret, caret);
  };

  const handleChange = (e) => {
    setInput(e);
    saveToLocal({ id: postId, content: input });
    // get and set local real-time caret position
    getCaretPostion();
    setCaretPostion();

    // socket, emit message
    const prevSocket = prevSocketRef.current;
    const dmp = new DiffMatchPatch();
    const patches = dmp.patch_make(prevSocket, e);
    let caret = localStorage.getItem("caret");
    const diff = {
      patches,
      userId: currentUserId,
      caret,
    };
    socket.emit("post", postId, diff);
    prevSocketRef.current = e;
  };

  const handleKeyPress = (e) => {
    getCaretPostion();
  };

  const handleClick = (e) => {
    // get local real-time caret position
    getCaretPostion();
  };

  const syncDoc = (diff, msg) => {
    // handle first socket msg
    if (msg || msg === "") {
      setInput(msg);
      prevSocketRef.current = msg;
    }
    // handle new edit from others
    if (diff) {
      const currentUserId = Number(localStorage.getItem("HEYMD_USERID"));
      const { patches, userId, caret } = diff;

      if (currentUserId !== userId) {
        const prevSocket = prevSocketRef.current;
        const dmp = new DiffMatchPatch();
        let newContent = dmp.patch_apply(patches, prevSocket);
        setInput(newContent[0]);
        prevSocketRef.current = newContent[0];

        // relocate local caret
        let localCaret = Number(localStorage.getItem("caret"));
        let diffs = patches[0].diffs;
        if (localCaret >= Number(caret)) {
          if (diffs[1] && diffs[1][0] === 1) {
            localStorage.setItem("caret", localCaret + diffs[1][1].length);
          }
          if (diffs[1] && diffs[1][0] === -1) {
            localStorage.setItem("caret", localCaret - diffs[1][1].length);
          }
        }
        setCaretPostion();
      }
    }
  };

  // set socket & get initial post data
  useEffect(() => {
    setSocket(io(ENDPOINT, { reconnect: true }));
    dispatch({
      type: "GET_POST_REQUEST",
      payload: {
        id: postId,
      },
    });
  }, [postId]);

  // join a new room
  useEffect(() => {
    if (socket) {
      socket.emit("join", postId);
    }
  }, [socket]);

  // listening on broadcast message
  useEffect(() => {
    if (socket) {
      socket.on("post", (data) => {
        const { room, diff, numOfUser, msg } = data;
        if (room === postId) {
          syncDoc(diff, msg);
          setUsers(numOfUser);
          dispatch({
            type: "UPDATE_NUMBER_OF_USERS",
            payload: {
              numOfUser: data.numOfUser,
            },
          });
        }
      });
      return () => {
        socket.close();
        localStorage.setItem("caret", 0);
      };
    }
  }, [socket]);

  return (
    <Container>
      <EditorContainer onKeyPress={handleKeyPress} onClick={handleClick}>
        <Editor
          value={input}
          height="calc(100vh - 50px)"
          onChange={handleChange}
          subfield
          preview
          toolbar={toolbar}
          placeholder={placeholder}
          language="en"
        />
      </EditorContainer>
      <Navbar style={{ postion: "relative", zIndex: 1 }} users={users} />
      <LoadingMask />
    </Container>
  );
};

export default SocketPage;
