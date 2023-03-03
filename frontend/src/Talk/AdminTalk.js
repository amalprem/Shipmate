import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router";

const AdminTalk = ({ userDetails }) => {
  const chatboxEl = useRef();
  const location = useLocation();
  const params = useParams();

  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);
  // const [userDetails, setUserDetails] = useState(null);
  // const [senderDetails, setSenderDetails] = useState(null);

  // setSenderDetails(userDetails);
  //   if (talkLoaded) {
  //     markTalkLoaded(false);
  //   }

  useEffect(() => {
    // if (location.state) {
    //   //   console.log(location.state.d);
    //   setUserDetails(location.state.d);
    //   //   window.location.reload();
    // }
    Talk.ready.then(() => markTalkLoaded(true));

    if (talkLoaded) {
      const currentUser = new Talk.User({
        id: "admin",
        name: "Admin",
        email: "admin@gmail.com",
        role: "default",
      });

      const otherUser = new Talk.User({
        id: userDetails.SenderId,
        name: userDetails.SenderName,
        email: userDetails.SenderEmail,
        role: "default",
      });

      const session = new Talk.Session({
        appId: "tS4F1NL5",
        me: currentUser,
      });

      const conversationId = Talk.oneOnOneId(currentUser, otherUser);
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(currentUser);
      conversation.setParticipant(otherUser);

      const chatbox = session.createChatbox();
      chatbox.select(conversation);
      chatbox.mount(chatboxEl.current);

      return () => session.destroy();
    }
  }, [talkLoaded, userDetails]);

  return (
    <div style={{ height: "500px" }} ref={chatboxEl}>
      {/* <b>Admin</b> */}
    </div>
  );
};

export default AdminTalk;
