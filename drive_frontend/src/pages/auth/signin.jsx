import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useDispatch } from 'react-redux'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp"
import { baseUrl } from '../../constant'
import { toast } from 'react-toastify'
import { EditIcon } from 'lucide-react'
import { login } from '../../store/auth/action'
import { LOADER_OFF, LOADER_ON } from '../../store/loader/actionTypes'
import axios from 'axios'
import { LOGIN_SUCCESS } from '../../store/auth/actionTypes'
import { useNavigate } from 'react-router-dom'

const OTPScreen = ({ email, password, setOtpScreen }) => {
  const [value, setValue] = React.useState("")
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const verifyOTP = async () => {
    try {
      toast.dismiss();
      dispatch({
        type: LOADER_ON
      });
      const response = await axios.post(`${baseUrl}/auth/verify_otp`, {
        email,
        otp: value
      }, {
        withCredentials: true
      });
      const { user } = response?.data;
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user
        }
      })
      localStorage.setItem("password", password)
      navigate("/")
    } catch (err) {
      console.log("error ", err);
      toast.dismiss()
      if (err.status !== 500) {
        if (err?.response?.data?.redirectToLogin === true) {
          toast.error(err?.response?.data?.error);
          setOtpScreen(false);
        } else {
          toast.error(err?.response?.data?.error);
          setValue("");
        }
      } else {
        toast.error(err.message || "Something Went Wrong!");
      }

    } finally {
      dispatch({
        type: LOADER_OFF
      })
    }
  }
  useEffect(() => {
    if (value.length === 6) {
      verifyOTP();
    }
  }, [value]);

  //   useEffect(() => () => toast.dismiss(), [])

  return (
    <>
      <h1 className='text-2xl font-bold text-center pb-2'> Verify OTP</h1>
      <div className='text-center justify-center mb-4 flex'>
        <span> An OTP has been sent to Email </span>
        <span className='text-blue-500 ml-[3px]'> {email} </span>
        <span className='italic underline cursor-pointer ml-[2px]' onClick={() => setOtpScreen(false)}> <EditIcon className='text-blue-500 hover:text-blue-600 underline' width={"20px"} /> </span>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <InputOTP maxLength={6} className="mb-6"
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot className="border-slate-300" index={0} />
            <InputOTPSlot className="border-slate-300" index={1} />
            <InputOTPSlot className="border-slate-300" index={2} />
            <InputOTPSlot className="border-slate-300" index={3} />
            <InputOTPSlot className="border-slate-300" index={4} />
            <InputOTPSlot className="border-slate-300" index={5} />
          </InputOTPGroup>
        </InputOTP>
        {/* <Button type="submit" className="mt-6 lg:w-[20%] py-5">
          Verify OTP
        </Button> */}
      </div>

    </>
  )
}
const SignIn = () => {

  const [showOTPScreen, setOtpScreen] = useState(false);
  const form = useForm({
    resolver: "",
    defaultValues: {
      email: "",
      password: "",
      isGuestUser: false
    }
  })
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    console.log("data ", data)
    dispatch(login(data, setOtpScreen));
  }
  // useEffect(() => {
  //   return () => toast.dismiss();
  // }, [])

  return (
    <div>
      {showOTPScreen ? <OTPScreen email={form.getValues("email")} password={form.getValues("password")} setOtpScreen={setOtpScreen} /> : (
        <>
          <h1 className='text-2xl font-bold text-center pb-4'> Sign In</h1>
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField 
                control={form.control}
                name="email"
                render={({field}) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="border w-full border-gray-700 p-5"
                          placeholder={"Your Email"}
                          {...field}
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )

                }}
              /> 
              <FormField 
                control={form.control}
                name="password"
                render={({field}) => {
                  return (
                    <FormItem>

                      <FormControl>
                        <Input
                          className="border w-full border-gray-700 p-5"
                          placeholder={"Your Password"}
                          {...field}
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )

                }}
              />

              <Button type="submit" className="w-full py-5">
                Submit
              </Button>
            </form>
          </Form> */}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="border w-full border-gray-700 p-5"
                          placeholder={"Your Email"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={`border w-full p-5 ${form.watch("isGuestUser") ? "bg-gray-200 cursor-not-allowed" : "border-gray-700"
                            }`}
                          placeholder={"Your Password"}
                          disabled={form.watch("isGuestUser")} // Disable when guest user is checked
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Checkbox for Guest User */}
              <FormField
                control={form.control}
                name="isGuestUser"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5 border-gray-700"
                            {...field}
                          />
                          <span className="text-gray-400">Login as Guest</span>
                        </label>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full py-5">
                Submit
              </Button>
            </form>
          </Form>

        </>
      )}

    </div>
  )
}

export default SignIn;
