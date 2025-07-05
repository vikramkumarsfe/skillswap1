import { Link,useNavigate } from "react-router-dom"
import { useState } from "react"
import firebaseAppConfig1 from "../utils/firabase"
import { getAuth,createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

const auth = getAuth(firebaseAppConfig1)


const SignUp = () => {



    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loader, setLoader] = useState(false)

    const [formValue, setFormValue] = useState({
    fullname: '',
    email: '',
    password: ''
    })

    const signup = async (e)=>{
            try {
                e.preventDefault()
                setLoader(true)
                await createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
                await updateProfile(auth.currentUser, {displayName: formValue.fullname})
                navigate('/')
            }
            catch(err)
            {
                setError(err.message)
            }
            finally {
                setLoader(false)
            }
        }
    


    const handleOnChange = (e)=>{
        const input = e.target
        const name = input.name
        const value = input.value
        setFormValue({
            ...formValue,
           [name]: value 
        })
        setError(null)
    }

    return (
                <div className=" grid md:grid-cols-2 gap-4 bg-gradient-to-r from-cyan-100 via-white to-blue-100">
                <div>
                    <img src="/images/login.jpg" className=" h-full md:block hidden" />
                </div>
                <div className="  flex md:px-16 px-4  py-8 items-center flex-col justify-center gap-3 w-[90%] mx-auto ">
                    <h1 className=" text-3xl  font-semibold text-center "> Teach What You Know. Learn What You Need. </h1>

                    <p className=" text-lg text-gray-500 "> Sign up to exchange real-world skills with motivated learners and grow together. </p>

                    <form className="  w-full p-4 space-y-3  "  onSubmit={signup}>

                        <div className=" space-y-1 ">
                            <label className=" text-lg font-medium  "> Name: </label>
                            <input 
                                onChange={handleOnChange}
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                required
                                className="border-2 block w-full py-2 px-4 rounded-md  "
                            />
                        </div>


                        <div className=" space-y-1 ">
                            <label className=" text-lg font-medium  "> Email: </label>
                            <input 
                                onChange={handleOnChange}
                                type="email"
                                name="email"
                                placeholder="abc@mail.com"
                                required
                                className="border-2 block w-full py-2 px-4 rounded-md  "
                            />
                        </div>

                        <div className=" space-y-1 ">
                            <label className=" text-lg font-medium  "> Password: </label>
                            <input 
                                onChange={handleOnChange}
                                type="password"
                                name="password"
                                placeholder="abc@mail.com"
                                required
                                className="border-2 block w-full py-2 px-4 rounded-md  "
                            />
                        </div>

                        

                        {
                        loader ? 
                        <h1 className="text-lg font-semibold text-gray-600">Loading...</h1>
                        :
                        <button
                        className=" bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-300"
                        >
                            Sign Up 
                        </button>
                    }
                    </form>

                    <p className=" text-gray-500 mt-1 text-left "> 
                        Already Have an account? 
                        <Link
                        to="/login"
                        className=" text-blue-500  "
                        >
                            Sign In
                        </Link>
                    </p>
                    {
                        error && 
                        <div className="flex justify-between items-center mt-2 bg-rose-600 p-3 rounded shadow text-white font-semibold animate__animated animate__pulse">
                            <p>{error}</p>
                            <button onClick={()=>setError(null)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                    }
                </div>
            </div>
    )
}

export default SignUp