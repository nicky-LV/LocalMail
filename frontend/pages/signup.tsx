import axios from 'axios';
import {LoggedInUser, LoginErrors, LoginField} from "../types";
import Router from "next/router";
import Cookies from 'js-cookie';
import {useState} from "react";
import {sign} from "crypto";


export default function Signup(props: object) {
  const [signUpError, setSignUpError] = useState<LoginErrors | null>(null);


  function onSubmit() {
    // Validate input and submit to API
    const email_address: string = document.getElementById("email").value
    const password: string = document.getElementById("password").value

    axios.post(`${process.env.NEXT_PUBLIC_API_SCHEME}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/signup`, {
      "email_address": email_address,
      "password": password
    }).then(response => {
      if (response.status === 200) {
        const data: LoggedInUser = response.data
        Cookies.set('uuid', data.uuid)
        Cookies.set('access_token', data.access_token)
        Cookies.set('refresh_token', data.refresh_token)

        // Refresh to dashboard
        Router.push('/dashboard')
      }
    }).catch(e => {
      if (e.response.status == 400) {
        console.log(e.response.data)
        setSignUpError(e.response.data)
      }
    })
  }

  return (
      <>
        <div className="h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex flex-row justify-center w-full">
              Logo
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

            {/* Signup card */}
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST" onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
              }}>

                {/* Email address input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Email field errors */}
                  {signUpError && signUpError.detail.field === LoginField.EMAIL && <p className="text-sm mt-2 text-red-600">
                    {signUpError.detail.message}
                  </p>}
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  {signUpError && signUpError.detail.field === LoginField.PASSWORD && <p className="text-sm mt-2 text-red-600">
                    {signUpError.detail.message}
                  </p>}
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/login" className="font-medium text-blue-600">
                      Have an account?
                    </a>
                  </div>
                </div>
                </div>

                <div>
                  <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>)
}