import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const MyChatComponent = ({ adminDetails }) => {
  console.log(adminDetails.id);
  const chatboxEl = useRef();

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);
  const url = "http://localhost:5000";

  useEffect(() => {
    Talk.ready.then(() => markTalkLoaded(true));
    console.log("Talk Loaded");
    console.log(talkLoaded);
    if (talkLoaded) {
      console.log(localStorage.getItem("id"));
      const currentUser = new Talk.User({
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        // photoUrl: "henry.jpeg",
        // welcomeMessage: "Hello!",
        // role: "default",
      });

      const otherUser = new Talk.User({
        id: adminDetails.id,
        name: adminDetails.name,
        email: adminDetails.email,
        // photoUrl: "jessica.jpeg",
        // welcomeMessage: "Hello!",
        // role: "default",
      });

      const session = new Talk.Session({
        appId: "tS4F1NL5",
        me: currentUser,
      });

      const conversationId = Talk.oneOnOneId(currentUser, otherUser);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(currentUser);
      conversation.setParticipant(otherUser);

      // const chatbox = session.createChatbox();
      // chatbox.select(conversation);
      // chatbox.mount(chatboxEl.current);
      const popup = session.createPopup();
      popup.select(conversation);
      popup.mount({ show: false });

      // document.getElementById("btn-getInTouch").style.backgroundColor = "black";
      // const button = document.getElementById("btn-getInTouch");
      // button.addEventListener("click", (event) => {
      //   event.preventDefault();
      //   popup.show();
      // });

      return () => session.destroy();
    }

    async function startMessaging() {
      const response = await axios.post(`${url}/startMessage`, {
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        role: localStorage.getItem("role"),
        // photoUrl: "henry.jpeg",
        // welcomeMessage: "Hello!",
        // role: "default",
      });
    }
    startMessaging();
  }, [talkLoaded]);

  return <div style={{ height: "500px" }}></div>;
};

export default MyChatComponent;
