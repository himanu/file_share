import React, { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useDispatch } from 'react-redux'
import { register } from '../../store/auth/action'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm({
    resolver: "",
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const onSubmit = (data) => {
    if (!data.email || !data.password) {
        toast.error("Email and Password are required");
        return;
    }
    dispatch(register(data, navigate));
  }
  // useEffect(() => () => toast.dismiss(), []);
  return (
    <div>
      <h1 className='text-2xl font-bold text-center pb-4'> Sign Up</h1>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)}
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
                      placeholder={"Enter Email"}
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
                      placeholder={"Enter Password"}
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
      </Form>
    </div>
  )
}

export default Signup;
