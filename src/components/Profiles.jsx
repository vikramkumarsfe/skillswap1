import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, push, set } from "firebase/database";
import { auth, rtdb } from "../utils/firabase";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const Profiles = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user || null); // Save current user if exists

        const usersRef = ref(rtdb, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
        const data = snapshot.val();
        const all = Object.entries(data).map(([uid, userData]) => ({
            uid,
            name: userData.displayName || "No Name",
            bio: userData.bio || "No bio provided",
            img: userData.photoURL || "/images/image.jpg",
            offer: (userData.skillsOffered || []).join(", "),
            want: (userData.skillsWanted || []).join(", "),
        }));

        const filtered = user
            ? all.filter((u) => u.uid !== user.uid)
            : all;

        setAllUsers(filtered);
        }
    });

    return () => unsubscribe();
    }, []);


  const filteredUsers = allUsers.filter((user) => {
    const search = query.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.offer.toLowerCase().includes(search) ||
      user.want.toLowerCase().includes(search)
    );
  });

  // 🔁 Send session request
  const sendSwapRequest = async (toUserId) => {
    if (!currentUser) {
      alert("Please login to send a session request.");
      navigate("/login");
      return;
    }

    const requestData = {
      from: currentUser.uid,
      to: toUserId,
      status: "pending",
      timestamp: Date.now(),
    };

    try {
      const requestRef = ref(rtdb, "swapRequests");
      const newRequestRef = push(requestRef);
      await set(newRequestRef, requestData);
      alert("Session request sent!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Something went wrong while sending request.");
    }
  };

  // 🧱 UI: Modal toggle
  const toggleModal = (user = null) => {
    setSelectedUser(user);
    setIsOpen(!isOpen);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-cyan-100 via-white to-blue-100 min-h-screen py-10">
        <div className="text-center w-10/12 mx-auto">
          {/* 🔍 Search Bar */}
          <div className="flex items-end space-x-2 p-4 rounded-xl max-w-md ml-auto">
            <input
              type="text"
              placeholder="Search the skills or name ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              className="flex items-center px-2 py-1 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition"
            >
              <i className="ri-search-line text-xl mr-1"></i>
            </button>
          </div>

          {/* 🧑‍🤝‍🧑 Headings */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">All Profiles</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            All user profiles in one place — see what skills others can teach or want to learn. Start a session and build your learning network.
          </p>

          {/* 🧩 User Cards */}
          <div className="p-4 grid md:grid-cols-4 gap-12">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No profiles match your search.</p>
            ) : (
              filteredUsers.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-300 rounded flex flex-col gap-2 p-4 shadow-lg"
                >
                  {/* 🖼️ Modal Trigger (only image+name clickable) */}
                  <div className="cursor-pointer" onClick={() => toggleModal(item)}>
                    <img src={item.img} className="w-[80px] h-[80px] mx-auto rounded-full" />
                    <h1 className="font-semibold text-lg text-center">{item.name}</h1>
                  </div>

                  <p className="text-gray-500 text-center">
                    {item.bio.length > 50 ? item.bio.slice(0, 50) + "..." : item.bio}
                  </p>

                  <h1 className="font-medium text-left">
                    Skills Offer: <span className="font-normal">{item.offer.slice(0, 15)}...</span>
                  </h1>
                  <h1 className="font-medium text-left">
                    Skills Want: <span className="font-normal">{item.want.slice(0, 15)}...</span>
                  </h1>

                  {currentUser ? (
                    <button
                        className="bg-cyan-600 border rounded py-3 text-white font-semibold hover:bg-[#56B6BC] hover:text-black"
                        onClick={(e) => {
                        e.stopPropagation();
                        sendSwapRequest(item.uid);
                        }}
                    >
                        Request Session
                    </button>
                    ) : (
                    <button
                        className="bg-gray-400 border rounded py-3 text-white font-semibold cursor-not-allowed"
                        onClick={() => navigate("/login")}
                    >
                        Login to Request
                    </button>
                    )}

                </div>
              ))
            )}
          </div>
        </div>

        {/* 🪟 Modal */}
        {isOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
                onClick={() => toggleModal(null)}
              >
                <i className="ri-close-line"></i>
              </button>

              <div className="flex flex-col items-center gap-3 w-10/12 mx-auto">
                <img src={selectedUser.img} className="w-[100px] h-[100px] rounded-full" />
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-500 text-justify">{selectedUser.bio}</p>
                <p className="text-left w-full"><strong>Skills Offered:</strong> {selectedUser.offer}</p>
                <p className="text-left w-full"><strong>Skills Wanted:</strong> {selectedUser.want}</p>
                <p className="text-sm mt-2 text-gray-500">
                  You can connect with this user to exchange skills and collaborate.
                </p>

                {currentUser ? (
                    <button
                        className="bg-cyan-600 border rounded py-3 px-7 text-white font-semibold hover:bg-[#56B6BC] hover:text-black"
                        onClick={() => {
                        sendSwapRequest(selectedUser.uid);
                        toggleModal(null);
                        }}
                    >
                        Request Session
                    </button>
                    ) : (
                    <button
                        className="bg-gray-400 border rounded py-3 px-7 text-white font-semibold"
                        onClick={() => {
                        toggleModal(null);
                        navigate("/login");
                        }}
                    >
                        Login to Request
                    </button>
                    )}

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profiles;
