import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push, set } from "firebase/database";
import { auth, rtdb } from "../../utils/firabase";
import Layoutuser from "./Layout";

const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

const ChatPage = () => {
  const { otherUid } = useParams(); // from /chat/:otherUid
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        // Fetch partner info from RTDB
        onValue(ref(rtdb, `users/${otherUid}`), snap => {
          if (snap.exists()) {
            setPartner(snap.val());
          }
        });

        const chatId = getChatId(user.uid, otherUid);
        onValue(ref(rtdb, `chatMessages/${chatId}`), snap => {
          const data = snap.val() || {};
          const msgArray = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
          setMessages(msgArray.sort((a, b) => a.timestamp - b.timestamp));
        });
      }
    });

    return () => unsubscribe();
  }, [otherUid]);

  const handleSend = async () => {
    if (!text.trim() || !currentUser) return;

    const chatId = getChatId(currentUser.uid, otherUid);
    const msgRef = push(ref(rtdb, `chatMessages/${chatId}`));

    await set(msgRef, {
      sender: currentUser.uid,
      text: text.trim(),
      timestamp: Date.now()
    });

    setText("");
  };

  if (!currentUser || !partner) return <Layoutuser><p className="p-6">Loading...</p></Layoutuser>;

  return (
    <Layoutuser>
    <div className="flex flex-col max-w-3xl mx-auto min-h-[550px] bg-white rounded-xl shadow p-4 mt-4">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-3 mb-4">
        <img
            src={partner.photoURL || "https://via.placeholder.com/150"}
            alt={partner.displayName}
            className="w-12 h-12 rounded-full border-2 border-blue-300"
        />
        <div>
            <h2 className="text-xl font-bold text-blue-800">{partner.displayName}</h2>
            <p className="text-sm text-gray-500">{partner.bio || "Let's connect and swap skills!"}</p>
        </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1 md:max-h-[60vh]">
        {messages.map(msg => (
            <div
            key={msg.id}
            className={`flex ${msg.sender === currentUser.uid ? "justify-end" : "justify-start"}`}
            >
            <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow
                ${msg.sender === currentUser.uid
                    ? "bg-blue-100 text-blue-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
            >
                {msg.text}
            </div>
            </div>
        ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2 border-t pt-3">
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
            Send
        </button>
        </div>
    </div>
    </Layoutuser>

  );
};

export default ChatPage;
