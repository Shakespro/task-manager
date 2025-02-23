"use client";
import { useUserContext } from "@/context/userContext";
import React from "react";

function LoginForm() {
  const { loginUser, userState, handlerUserInput } = useUserContext();
  const { email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="relative flex justify-center items-center h-screen w-screen bg-white">
      {/* Extended Gold Background */}
      <div className="absolute inset-0 bg-[#FFD700] rounded-[50%] w-[80%] h-[90%] md:w-[60%] md:h-[75%] lg:w-[50%] lg:h-[70%] mx-auto blur-[100px] opacity-15"></div>

      {/* Form Container */}
      <form className="relative z-10 px-10 py-14 rounded-lg bg-[#1E1E1E] border border-[#FFD700] w-full max-w-[520px] text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-bold text-[#FFD700]">
            Login to Your Account
          </h1>
          <p className="mb-8 px-[2rem] text-center text-gray-400 text-[14px]">
            Login Now. Don't have an account?{" "}
            <a
              href="/register"
              className="font-bold text-[#FFD700] hover:text-[#E6C200] transition-all duration-300"
            >
              Register here
            </a>
          </p>

          <div className="mt-[1rem] flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-400">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => handlerUserInput("email")(e)}
              name="email"
              className="px-4 py-3 border-2 rounded-md outline-none bg-black text-white border-[#FFD700] placeholder-gray-500"
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div className="relative mt-[1rem] flex flex-col">
            <label htmlFor="password" className="mb-1 text-gray-400">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => handlerUserInput("password")(e)}
              name="password"
              className="px-4 py-3 border-2 rounded-md outline-none bg-black text-white border-[#FFD700] placeholder-gray-500"
              placeholder="***************"
            />
            <button
              type="button"
              className="absolute p-1 right-4 top-[43%] text-[20px] text-gray-400 hover:text-[#FFD700] transition duration-300"
              onClick={togglePassword}
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href="/forgot-password"
              className="font-bold text-[#FFD700] text-[14px] hover:text-[#E6C200] transition-all duration-300"
            >
              Forgot password?
            </a>
          </div>

          <div className="flex">
            <button
              type="submit"
              disabled={!email || !password}
              onClick={loginUser}
              className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-black text-white rounded-md
                hover:bg-[#FFD700] hover:text-black transition-all duration-300"
            >
              Login Now
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
