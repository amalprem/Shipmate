import React from "react";
import "../css/chat.css";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [name, setName] = useState("hkande");
  const url = "http://localhost:5000";
  const username = "hkande";

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const onsubmit = () => {
    console.log(messages);
    // setMessages([
    //   ...messages,
    //   [{ SenderEmail: username, SenderMessage: message }],
    // ]);
    document.getElementById("message").value = "";
    const response = axios.post(`${url}/sendMessage`, {
      msg: message,
      sender: username,
      reply: "",
    });
  };

  const fetchMessages = async () => {
    const response = await axios.post(`${url}/getMessages`, {
      senderEmail: "hkande",
    });
    if (response.status === 200) {
      setMessages(response.data);
    }
  };

  const closeChat = async () => {
    const response = await axios.post(`${url}/endChat`, {
      senderEmail: "hkande",
    });
    console.log(response);
    if (response.status === 200) {
      console.log(response);
      // navigate("/landing-page");
    }
  };
  const endChat = () => {
    closeChat();
  };

  useEffect(() => {
    fetchMessages();
  }, [messages, message]);

  return (
    <div className="chat-container">
      <div className="message">
        {/* {messages.map((item, i) => {
          return (
            <div>
              <b>{item[1]}</b>
              <li key={i}>{item[0]}</li>
            </div>
          );
        })} */}
        {console.log(messages)}
        {Object.keys(messages).map((key) => {
          if (!messages[key].SenderMessage) {
            return (
              <div className="reply">
                <b>{messages[key].ReplyEmail}</b>
                {"    "}
                <p>{messages[key].ReplyMessage}</p>
                {/* <p>{messages[key].SenderTimeStamp}</p> */}
              </div>
            );
          } else {
            return (
              <div className="sender">
                <b>{messages[key].SenderEmail}</b>
                {"    "}
                <p>{messages[key].SenderMessage}</p>
                {/* <p>{messages[key].SenderTimeStamp}</p> */}
              </div>
            );
          }
        })}
      </div>
      <div className="seconddiv">
        <TextField
          margin="normal"
          required
          id="message"
          label="Enter your message"
          name="message"
          onChange={handleChange}
          autoComplete="message"
          autoFocus
        />
      </div>
      <div className="seconddiv">
        <Button
          type="button"
          variant="contained"
          style={{ width: "50%" }}
          sx={{ mt: 2, mb: 2 }}
          onClick={onsubmit}
        >
          Send message
        </Button>
        {"       "}
        <Button
          type="button"
          style={{ width: "30%", color: "red" }}
          sx={{ mt: 2, mb: 2 }}
          onClick={endChat}
        >
          End Chat
        </Button>
      </div>
    </div>
  );
};

export default Chat;
