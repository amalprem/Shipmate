import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";

const GroupChat = () => {
  const chatboxEl = useRef();

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);

  useEffect(() => {
    Talk.ready.then(() => markTalkLoaded(true));
    console.log("Talk Loaded");
    console.log(talkLoaded);
    if (talkLoaded) {
      console.log(localStorage.getItem("id"));
      const currentUser = new Talk.User({
        id: "admin",
        name: "Admin",
        email: "admin@gmail.com",
        // photoUrl: "henry.jpeg",
        // welcomeMessage: "Hello!",
        // role: "default",
      });

      var other1 = new Talk.User({
        id: "654321",
        name: "Sebastian",
        email: "sebastian@example.com",
      });

      var other2 = new Talk.User({
        id: "456789",
        name: "Steve",
        email: "steve@example.com",
      });

      const session = new Talk.Session({
        appId: "tS4F1NL5",
        me: currentUser,
      });

      var conversation =
        window.talkSession.getOrCreateConversation("CONVERSATION_ID");
      conversation.setParticipant(me);
      conversation.setParticipant(other1);
      conversation.setParticipant(other2);
      conversation.setAttributes({
        photoUrl: "https://demo.talkjs.com/img/11.jpg",
        subject: "Beautiful Steel Preserve for rent!",
      });

      var chatbox = talkSession.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(document.getElementById("talkjs-container"));

      return () => session.destroy();
    }
  }, [talkLoaded]);

  return <div style={{ height: "500px" }}></div>;
};

export default GroupChat;
