
import 'remixicon/fonts/remixicon.css'
import Home from "./components/Home"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profiles from './components/Profiles'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Layoutuser from './components/user/Layout'
import PreGuard from './components/Guard/PreGuard'
import AuthGuard from './components/Guard/AuthGuard'
import MySwaps from './components/user/MySwaps'
import UpdateProfile from './components/user/update.jsx'
import ChatPage from './components/user/chat.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path='/' element= { <Home/> }/>
        <Route path='/profiles' element={<Profiles />} />
        

        <Route element={<PreGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<AuthGuard/>}>
          <Route path='/profile'  element={ <Layoutuser/> }/>
          <Route path="/user/myswaps" element={<MySwaps />} />
          <Route path='/user/profile' element = { <UpdateProfile />} /> 
          <Route path="/user/chat/:otherUid" element={<ChatPage />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App