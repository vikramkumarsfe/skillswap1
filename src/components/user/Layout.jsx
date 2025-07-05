import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import firebaseAppConfig1 from "../../utils/firabase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const auth = getAuth(firebaseAppConfig1);
const rtdb = getDatabase(firebaseAppConfig1);

const Layoutuser = ({ children }) => {
  const navigate = useNavigate();
  const [size, setSize] = useState(250);
  const [mobileSize, setMobileSize] = useState(0);
  const [accountMenu, setAccountMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await get(ref(rtdb, `users/${user.uid}`));
        if (snap.exists()) {
          setUserProfile(snap.val());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signOutfunc = () => {
    signOut(auth);
    navigate("/");
  };

  const menus = [
    { label: "Home", icon: <i className="ri-home-2-line mr-2"></i>, link: "/" },
    { label: "My Swaps", icon: <i className="ri-arrow-left-right-line mr-2"></i>, link: "/user/myswaps" },
    { label: "Discover Skills", icon: <i className="ri-compass-3-line mr-2"></i>, link: "/profiles" },
    { label: "Profile", icon: <i className="ri-user-3-line mr-2"></i>, link: "/user/profile" },
  ];

  const avatar = userProfile?.photoURL || "/images/avt.avif";
  const name = userProfile?.displayName || "User";
  const email = userProfile?.email || "example@gmail.com";

  return (
    <>
      {/* Desktop */}
      <div className="md:block hidden">
        <aside
          className="bg-[#D8EDFE] fixed top-0 left-0 h-full overflow-hidden"
          style={{ width: size, transition: "0.3s" }}
        >
          <div className="flex flex-col m-4 box-border">
            {menus.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="px-4 py-3 text-black text-[17.5px] hover:bg-cyan-400 hover:text-black block rounded"
                style={{ background: location.pathname === item.link ? "#56B5BD" : "transparent" }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              className="text-left px-4 py-3 text-black rounded text-[17.5px] hover:bg-rose-600 hover:text-white"
              onClick={signOutfunc}
            >
              <i className="ri-logout-circle-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </aside>

        <section className="bg-gray-100 h-full" style={{ marginLeft: size, transition: "0.3s" }}>
          <nav className="bg-gradient-to-b from-cyan-100 via-blue-100 to-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                className="bg-transparent hover:bg-[#56B5BD] hover:text-white w-8 h-8 rounded"
                onClick={() => setSize(size === 250 ? 0 : 250)}
              >
                <i className="ri-menu-2-line text-2xl"></i>
              </button>
              <div className="flex items-center justify-center gap-2">
                <img src="/images/logo.png" className="h-12" />
                <p className="text-2xl font-semibold mb-4">SkillSwap</p>
              </div>
            </div>

            <div>
              <button className="relative">
                <img
                  src={avatar}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                  onClick={() => setAccountMenu(!accountMenu)}
                />
                {accountMenu && (
                  <div className="absolute top-16 right-0 bg-white w-[220px] p-4 rounded shadow-lg z-50">
                    <div>
                      <h1 className="text-lg font-semibold">{name}</h1>
                      <p className="text-sm text-gray-500">{email}</p>
                      <div className="h-px bg-gray-200 my-4" />
                      <button onClick={signOutfunc} className="text-center font-medium  w-full  hover:underline">
                        <i className="ri-logout-circle-r-line mr-2"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </nav>

          <div className="p-6">{children}</div>
        </section>
      </div>

      {/* Mobile (same avatar and info shown on nav) */}
      <div className="md:hidden block">
        <aside
          className="bg-[#D8EDFE] fixed top-0 left-0 h-full z-50 overflow-hidden"
          style={{ width: mobileSize, transition: "0.3s" }}
        >
          <div className="flex flex-col m-4">
            <button className="text-left mx-4 mt-4" onClick={() => setMobileSize(mobileSize === 0 ? 250 : 0)}>
              <i className="ri-menu-2-fill text-xl text-black"></i>
            </button>
            {menus.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="px-4 py-3 text-[17.5px] hover:bg-cyan-400 text-black"
                style={{ background: location.pathname === item.link ? "#56B5BD" : "transparent" }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              className="text-left px-4 py-3 text-[17.5px] hover:bg-rose-600 text-black"
              onClick={signOutfunc}
            >
              <i className="ri-logout-circle-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </aside>

        <section className="bg-gray-100 h-screen">
          <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                className="bg-gray-50 hover:bg-[#56B5BD] rounded w-8 h-8"
                onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}
              >
                <i className="ri-menu-2-line text-xl text-black"></i>
              </button>
              <div className="flex items-center justify-center gap-2">
                <img src="/images/logo.png" className="h-12" />
                <p className="text-2xl font-semibold mb-4">SkillSwap</p>
              </div>
            </div>

            <div>
              <button className="relative">
                <img
                  src={avatar}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                  onClick={() => setAccountMenu(!accountMenu)}
                />
                {accountMenu && (
                  <div className="absolute top-16 right-0 bg-white w-[220px] p-4 rounded shadow-lg z-50">
                    <div>
                      <h1 className="text-lg font-semibold">{name}</h1>
                      <p className="text-sm text-gray-500">{email}</p>
                      <div className="h-px bg-gray-200 my-4" />
                      <button onClick={signOutfunc} className="text-center font-medium w-full  hover:underline">
                        <i className="ri-logout-circle-r-line mr-2"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </nav>

          <div className="p-6">{children}</div>
        </section>
      </div>
    </>
  );
};

export default Layoutuser;
