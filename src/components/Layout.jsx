import { useState,useEffect } from "react"
import { Link,useNavigate } from "react-router-dom"
import firebaseAppConfig1 from "../utils/firabase"
import { getAuth,onAuthStateChanged, signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, get } from "firebase/database";

const auth = getAuth(firebaseAppConfig1)


const Layout = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [accountMenu, setAccountMenu] = useState(false)
    const [session, setSession] = useState(null)
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
            const db = getDatabase(firebaseAppConfig1);
            const snapshot = await get(ref(db, `users/${user.uid}/photoURL`));

            const photoURL = snapshot.exists() ? snapshot.val() : "/images/image.jpg";

            setSession({
                ...user,
                photoURL,
            });

            } else {
            setSession(false);
            }
        });
        }, []);

        const handleProfileClick = () => {
            if (user.displayName !== "") {
            navigate("/user/myswaps");
            } else {
            navigate("/user/profile");
            }
        };


    const mobileLink = (href)=>{
        navigate(href)
        setOpen(false)
    }

    if(session === null)
    return (
        <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
            <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
            </span>
        </div>
    )

    return (
        <div>
            <nav className="py-4 md:px-16  px-8 flex justify-between bg-gradient-to-b from-cyan-100 via-blue-100 to-white shadow-lg absolute sticky top-0 left-0 z-30 ">
                <div className="flex items-center justify-center gap-2 ">
                    <img src="/images/logo.png"  className="h-12 "/>
                    <p className="text-2xl font-semibold mb-4 "> SkillSwap </p>
                </div>
                <ul className=" flex  md:gap-16  font-semibold text-lg  md:flex hidden ">
                    <li className="align-middle cursor-pointer  flex items-center justify-center px-7 rounded  hover:bg-cyan-400">
                        <Link 
                            to="/"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="align-middle cursor-pointer  flex items-center justify-center px-7 rounded  hover:bg-cyan-400"> 
                        <Link 
                            to="/profiles"
                        >
                            Discover Skills 
                        </Link>
                    </li>
                    


                    {
                        !session && 

                        <button className="align-middle cursor-pointer  flex items-center justify-center px-7 rounded bg-cyan-400 hover:bg-[#244558] hover:text-white ">
                        
                            <Link 
                                to="/login"
                            >
                                Login 
                            </Link>
                        </button>
                    }

                    {
                        session && 

                        <button className="relative" onClick={()=>setAccountMenu(!accountMenu)}>
                                <img src={session.photoURL || "/images/image.jpg"} className="w-10 h-10 rounded-full" />
                                {
                                    accountMenu && 
                                    <div className="flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-3 bg-white absolute top-12 right-0 shadow-xl">
                                        
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                            <i className="ri-user-line mr-2"></i>
                                            My Profile
                                        </button>
                                        
                                            
                                            
                                        

                                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>signOut(auth)}> 
                                            <i className="ri-logout-circle-r-line mr-2"></i>
                                            Logout
                                        </button>
                                    </div>
                                }
                            </button>
                    }
                </ul>

                <button
                onClick={()=>setIsOpen(!isOpen)}
                className=" md:hidden block ">
                        <i className="ri-menu-3-line text-xl  "></i>
                </button>


            </nav>

            <aside className=" md:hidden h-screen   bg-[#D8EDFE]  fixed top-0 left-0 z-50 flex flex-col gap-3 overflow-hidden pt-8"
            style={{
                width : isOpen ? 250 : 0,
                transition : '0.3s',

            }}
            >
                <div className="flex items-center justify-center gap-2 ">
                    <img src="/images/logo.png"  className="h-12 "/>
                    <p className="text-2xl font-semibold mb-4 "> SkillSwap </p>
                </div>
                <ul className=" flex flex-col gap-5  font-semibold text-xl px-4   ">

                    

                    {
                        session && 

                        <button className="relative ml-5 " onClick={()=>setAccountMenu(!accountMenu)}>
                                <img src="/images/image.jpg" className="w-10 h-10 rounded-full" />
                                {
                                    accountMenu && 
                                    <div className="flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-3 bg-white absolute top-12 right-10 shadow-xl">
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100">
                                            <i className="ri-user-line mr-2"></i>
                                            My Profile
                                        </button>

                                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={()=>signOut(auth)}> 
                                            <i className="ri-logout-circle-r-line mr-2"></i>
                                            Logout
                                        </button>
                                    </div>
                                }
                            </button>
                    }


                    <li className="align-middle cursor-pointer  flex  px-4 py-2  rounded  hover:bg-cyan-400">
                        <Link 
                            to="/"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="align-middle cursor-pointer  flex items-center  px-4 py-2 rounded  hover:bg-cyan-400"> 
                        <Link 
                            to="/profiles"
                        >
                            Discover Skills 
                        </Link>
                    </li>

                    {
                        !session && 

                        <button className="align-middle cursor-pointer  flex items-center  px-4 py-2  rounded bg-cyan-400 hover:bg-[#244558] hover:text-white ">
                        
                            <Link 
                                to="/login"
                            >
                                Login 
                            </Link>
                        </button>
                    }
                    
                </ul>

            </aside>

            <div>
                {children}
            </div>

            <footer className="px-16 py-12  bg-[#244558] text-white  grid md:grid-cols-4 gap-8">
                <div className=" p-3 box-border ">
                    <div className="flex items-center gap-2 ">
                        <img src="/images/logo.png"  className="h-12 "/>
                        <h1 className=" text-2xl font-semibold "> Skill Swap </h1>
                    </div>
                    <p className=" text-gray-500 text-justify mt-3 "> Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ad praesentium perferendis commodi qui sunt itaque distinctio, numquam in sequi ab, quia reiciendis pariatur similique. Excepturi sint neque hic omnis!</p>
                </div>

                <div className=" p-3 box-border ">
                    <h1 className=" text-2xl font-semibold "> Social Links </h1>
                    <div className="mt-3 flex flex-col gap-1 text-gray-500 ">
                        <div className="">
                            <p className=" flex items-center  gap-2 font-semibold ">
                                <i className="ri-youtube-fill text-2xl "></i> Youtube 
                            </p>
                        </div>

                        <div className="">
                            <p className=" flex items-center  gap-2 font-semibold">
                                <i className="ri-instagram-line text-2xl "></i> Instagram
                            </p>
                        </div>

                        <div className="">
                            <p className=" flex items-center  gap-2 font-semibold">
                                <i className="ri-linkedin-fill text-2xl "></i> LinkedIn
                            </p>
                        </div>

                        <div className="">
                            <p className=" flex items-center  gap-2 font-semibold">
                                <i className="ri-facebook-fill text-2xl "></i> Facebook 
                            </p>
                        </div>
                    </div>
                </div>
                <div className=" p-3 box-border ">
                    <h1 className=" text-2xl font-semibold "> Website Links </h1>
                    <div className="mt-3 flex flex-col gap-1 text-gray-500 px-3 ">
                        <p className=" text-lg "> Home </p>

                        <p className=" text-lg "> Find Buddy  </p>

                        <p className=" text-lg "> SignUp </p>

                        <p className=" text-lg "> Login  </p>
                    </div>

                </div>
                <div className=" px-3 py-1  box-border ">
                    <h1 className=" text-2xl font-semibold "> Contact Us  </h1>
                        <form className="space-y-3 mt-3 ">
                            <input 
                                required
                                name="fullname"
                                className="bg-white w-full rounded p-2"
                                placeholder="Your name"
                            />

                            <input 
                                required
                                type="email"
                                name="email"
                                className="bg-white w-full rounded p-2"
                                placeholder="Enter email id"
                            />

                            <textarea 
                                required
                                name="message"
                                className="bg-white w-full rounded p-2"
                                placeholder="Message"
                                rows={3}
                            />

                            <button className="bg-black text-white py-3 px-6 rounded">Submit</button>
                        </form>
                </div>
            </footer>
        </div>
    )
}

export default Layout