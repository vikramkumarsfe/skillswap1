import { useEffect, useState } from "react";
import { auth, rtdb } from "../../utils/firabase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, get, update, remove } from "firebase/database";
import Layoutuser from "./Layout";
import { useNavigate } from "react-router-dom";


const UserCard = ({ user, onAccept, onReject, onCancel, onChat }) => (
  <div className="bg-white p-4 rounded-lg shadow w-full md:w-[280px]">
    <h3 className="text-lg font-bold">{user.name}</h3>
    <p className="text-sm text-gray-600">{user.bio}</p>

    <div className="mt-2 text-xs text-gray-500">Offers:</div>
    <div className="flex flex-wrap gap-1 mb-1">
      {user.skillsOffered?.map((s, i) => (
        <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">{s}</span>
      ))}
    </div>

    <div className="text-xs text-gray-500">Wants:</div>
    <div className="flex flex-wrap gap-1 mb-3">
      {user.skillsWanted?.map((s, i) => (
        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">{s}</span>
      ))}
    </div>

    {user.status === "accepted" && (
      <>
        <button className="w-full bg-red-500 text-white py-1 rounded" onClick={onCancel}>End Swap</button>
        <button
            className="w-full bg-blue-500 text-white py-1 rounded mt-2"
            onClick={onChat}
            >
            Chat
        </button>
      </>
    )}
    {user.status === "received" && (
      <div className="flex gap-2">
        <button className="flex-1 bg-green-500 text-white py-1 rounded" onClick={onAccept}>Accept</button>
        <button className="flex-1 bg-gray-400 text-white py-1 rounded" onClick={onReject}>Reject</button>
      </div>
    )}
    {user.status === "sent" && (
      <button className="w-full bg-yellow-500 text-white py-1 rounded" onClick={onCancel}>Cancel Request</button>
    )}
  </div>
);

const MySwaps = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState({});
  const [swapRequests, setSwapRequests] = useState([]);
  const navigate = useNavigate()

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setCurrentUser(user);

      const userSnap = await get(ref(rtdb, `users/${user.uid}`));
      if (userSnap.exists()) {
        setProfile(userSnap.val());
      }

      const usersSnapshot = await get(ref(rtdb, "users"));
      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        setUserData(users);

        // 🔧 Filter only relevant requests
        onValue(ref(rtdb, "swapRequests"), (snap) => {
          const all = snap.val() || {};

          const relevantRequests = Object.entries(all)
            .filter(([_, req]) => req.from === user.uid || req.to === user.uid) // 🔒 only related to this user
            .map(([id, req]) => {
              const fromUser = users[req.from] || {};
              const toUser = users[req.to] || {};

              return {
                id,
                from: req.from,
                to: req.to,
                status: req.status,
                timestamp: req.timestamp,
                partner: req.from === user.uid
                  ? { ...toUser, uid: req.to }
                  : { ...fromUser, uid: req.from },
                isSender: req.from === user.uid,
              };
            });

          setSwapRequests(relevantRequests);
        });
      }
    }
  });

  return () => unsubscribe();
}, []);


  const handleAccept = (id) => update(ref(rtdb, `swapRequests/${id}`), { status: "accepted" });
  const handleReject = (id) => update(ref(rtdb, `swapRequests/${id}`), { status: "rejected" });
    const handleCancel = async (id, partnerUid) => {
    await remove(ref(rtdb, `swapRequests/${id}`));
    const chatId = getChatId(currentUser.uid, partnerUid);
    await remove(ref(rtdb, `chatMessages/${chatId}`));
    };

  const current = swapRequests.filter(r => r.status === "accepted");
  const received = swapRequests.filter(r => r.status === "pending" && !r.isSender);
  const sent = swapRequests.filter(r => r.status === "pending" && r.isSender);

  if (!currentUser || !profile) return <Layoutuser><p className="p-6">Loading...</p></Layoutuser>;

  return (
    <Layoutuser>
      <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
        {/* Profile */}
        <section className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8 items-center justify-between text-lg">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md">
            <img src={profile.photoURL || "https://via.placeholder.com/150?text=User"} alt="Profile" className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-800">{profile.displayName}</h2>
            <p className="italic text-gray-600">{profile.bio}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile:</strong> {profile.mobile}</p>
            <p><strong>Address:</strong> {profile.address}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="font-semibold text-green-700 mb-1">✅ Skills Offered:</p>
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {profile.skillsOffered?.map((skill, i) => (
                <span key={i} className="bg-green-200 text-green-900 text-sm px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
            <p className="font-semibold text-blue-700 mb-1">🎯 Skills Wanted:</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {profile.skillsWanted?.map((skill, i) => (
                <span key={i} className="bg-blue-200 text-blue-900 text-sm px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Current Swaps */}
        <section>
          <h2 className="text-xl font-bold mb-4">Current Swaps</h2>
          <div className="flex flex-wrap gap-4">
            {current.length ? current.map(r => (
              <UserCard
                key={r.id}
                user={{ ...r.partner, status: "accepted", name: r.partner.displayName, skillsOffered: r.partner.skillsOffered, skillsWanted: r.partner.skillsWanted, bio: r.partner.bio }}
                onCancel={() => handleCancel(r.id)}
                onChat={() => navigate(`/user/chat/${r.partner.uid}`)}
              />
            )) : <p className="text-gray-500">No current swaps.</p>}
          </div>
        </section>

        {/* Requests Received */}
        <section>
          <h2 className="text-xl font-bold mb-4">Swap Requests Received</h2>
          <div className="flex flex-wrap gap-4">
            {received.length ? received.map(r => (
              <UserCard
                key={r.id}
                user={{ ...r.partner, status: "received", name: r.partner.displayName, skillsOffered: r.partner.skillsOffered, skillsWanted: r.partner.skillsWanted, bio: r.partner.bio }}
                onAccept={() => handleAccept(r.id)}
                onReject={() => handleReject(r.id)}
              />
            )) : <p className="text-gray-500">No incoming requests.</p>}
          </div>
        </section>

        {/* Requests Sent */}
        <section>
          <h2 className="text-xl font-bold mb-4">Requests You Sent</h2>
          <div className="flex flex-wrap gap-4">
            {sent.length ? sent.map(r => (
              <UserCard
                key={r.id}
                user={{ ...r.partner, status: "sent", name: r.partner.displayName, skillsOffered: r.partner.skillsOffered, skillsWanted: r.partner.skillsWanted, bio: r.partner.bio }}
                onCancel={() => handleCancel(r.id)}
              />
            )) : <p className="text-gray-500">No sent requests.</p>}
          </div>
        </section>
      </div>
    </Layoutuser>
  );
};

export default MySwaps;
