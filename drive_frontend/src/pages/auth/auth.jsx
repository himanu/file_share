import React, { useEffect } from 'react'
import "./Auth.css";
import Signup from './signup';
import Signin from './signin';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
// import Forgotpassword from './Forgotpassword';
import { useSelector } from 'react-redux';

const Auth = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const auth = useSelector((store) => store.auth);

  // useEffect(() => {
  //   if (!auth.loading && auth.user) {
  //     navigate("/");
  //   }
  // }, [auth.user])
  return (
    <div className='absolute top-0 left-0 w-[100vw] h-screen authContainer'>
      <div className='absolute top-0 right-0 left-0 bottom-0 bg-[#030712]
        bg-opacity-50
      '>
        <div className='bgBlure absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center
            h-full w-full rounded-md z-50 bg-black bg-opacity-50 shadow-2xl 
            shadow-white
        '>
            <h1 className='text-6xl font-bold pb-9'>
                File Drive
            </h1>
            {type == "signup" ? (
              <section className='w-[80%] lg:w-[35%]'>
                <Signup />
                <div className='flex mt-2 gap-2 items-center justify-center'>
                  <span> Already have account? </span>
                  <Button onClick={() => navigate("/auth/signin")} variant="secondary">
                    Sign In
                  </Button>
                </div>
              </section>) : (
              <section className='w-[80%] lg:w-[35%]'>
                <Signin />
                <div className='flex mt-6 gap-2 items-center justify-center'>
                  <span> Don't have account? </span>
                  <Button onClick={() => navigate("/auth/signup")} variant="secondary">
                    Sign Up
                  </Button>
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  )
}

export default Auth
