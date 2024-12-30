import { useContext, useEffect, useState } from 'react'
import './App.css'
import Auth from './pages/auth/auth'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Loader from './components/ui/loader'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './store/auth/action'
import FileShareComponent from './pages/file'
import Navbar from './pages/Navbar'
import FileDetails from './pages/file/file'

const endpoints = [
  {path: '/auth/:type', component: <Auth />, isPublic: true},
  {path: '/', component: <FileShareComponent />, isPublic: false},
  {path: '/file/:fileId', component: <FileDetails />, isPublic: false}
]
function App() {
  const { loading } = useSelector((store) => store.loader)
  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser(navigate))
  }, [])
  return (
    <>
    <div>
      <Routes>
        {endpoints.map((item, idx) => {
          if (item.isPublic) {
            return (
              <Route path={item.path} key={idx} element={item.component} />
            )
          } else {
            return <Route path={item.path} key={idx} element={<PrivateComponent> {item.component} </PrivateComponent>} />
          }
        })}
      </Routes>
      <ToastContainer />
      
      {loading && <Loader />}
    </div>
    </>
  )
}
const PrivateComponent = ({children}) => {

  return <>
  <Navbar />
  {children}
  </>
}
export default App
