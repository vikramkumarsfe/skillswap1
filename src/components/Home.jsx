import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  limitToFirst,
  onValue,
} from "firebase/database";
import firebaseAppConfig1 from "../utils/firabase";
import { auth } from "../utils/firabase";
import { onAuthStateChanged } from "firebase/auth";

const rtdb = getDatabase(firebaseAppConfig1);

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch first 8 users
    const usersRef = ref(rtdb, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userList = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));


        const shuffled = userList.sort(() => 0.5 - Math.random());
        const randomUsers = shuffled.slice(0, 8);
        setUsers(randomUsers);
      }
    });

    // Auth check
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleRequestSession = (userId) => {
    if (!currentUser) {
      alert("Please login to send a session request.");
      navigate("/login");
      return;
    }

    // You can add request logic here
    alert(`Request sent to user ID: ${userId}`);
  };

  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 h-[650px] overflow-hidden">
          {/* Decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-32 left-40 w-28 h-28 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full"></div>
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-32 left-16 bg-white/20 backdrop-blur-sm rounded-lg p-4 animate-bounce">
              <div className="w-8 h-8 bg-white rounded opacity-80"></div>
            </div>
            <div className="absolute top-48 right-24 bg-white/20 backdrop-blur-sm rounded-lg p-4 animate-pulse">
              <div className="w-8 h-8 bg-white rounded opacity-80"></div>
            </div>
            <div className="absolute bottom-40 left-20 bg-white/20 backdrop-blur-sm rounded-lg p-4 animate-bounce delay-300">
              <div className="w-8 h-8 bg-yellow-300 rounded-full opacity-90"></div>
            </div>
            <div className="absolute bottom-32 right-32 bg-white/20 backdrop-blur-sm rounded-lg p-4 animate-pulse delay-500">
              <div className="w-8 h-8 bg-white rounded opacity-80"></div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Unlock your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  potential
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Connect with study buddies, exchange skills, and grow together in
                your learning journey
              </p>
              <button className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-12 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <span className="flex items-center justify-center">
                  Start swapping
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-16 fill-white">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </div>

        {/* Study Buddy Section */}
        <div className="py-20 w-10/12 mx-auto">
          <div className="mx-auto px-2">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Connect. Learn. Teach. Repeat.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A collaborative learning platform for exchanging skills without
                the need for money.
              </p>

              <div className="p-4 grid md:grid-cols-4 gap-12 mt-12">
                {users.map((item, index) => (
                  <div
                    className="bg-slate-300 rounded flex flex-col gap-2 p-4 shadow-lg"
                    key={index}
                  >
                    <img
                      src={item.photoURL}
                      className="w-[80px] h-[80px] mx-auto rounded-full"
                    />
                    <h1 className="font-semibold text-lg">
                      {item.displayName}
                    </h1>
                    <p className="text-gray-500">{item.bio?.length > 50 ? item.bio.slice(0, 50) + "..." : item.bio}</p>
                    <h1 className="font-medium">
                      Skills Offer :
                      <span className="font-normal"> {item.skillsOffered?.length > 15
                            ? item.skillsOffered.slice(0, 15) + "..."
                            : item.skillsOffered}</span>
                    </h1>
                    <h1 className="font-medium">
                      Skills Want :
                      <span className="font-normal"> {item.skillsWanted?.length > 15
                            ? item.skillsWanted.slice(0, 15) + "..."
                            : item.skillsWanted}</span>
                    </h1>
                    <button
                      onClick={() => handleRequestSession(item.id)}
                      className="bg-cyan-600 border rounded py-3 text-white font-semibold hover:bg-[#56B6BC] hover:text-black"
                    >
                      Request Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* View All */}
            <div className="text-center mt-12">
              <button className="bg-white text-gray-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 border-2 border-gray-200">
                <Link to="/profiles">View All Profiles</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
