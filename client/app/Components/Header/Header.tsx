"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const { user } = useUserContext();
  const { openModalForAdd, activeTasks } = useTasks();
  const router = useRouter();
  const { name } = user;
  const userId = user._id;

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      {/* Left Section: Welcome Text + Add Task Button */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-medium">
            <span role="img" aria-label="wave">👋</span>
            {userId ? ` Welcome, ${name}!` : "Welcome to HustleHub"}
          </h1>
          <p className="text-sm">
            {userId ? (
              <>
                You have{" "}
                <span className="font-bold text-[#3aafae]">
                  {activeTasks.length}
                </span>
                &nbsp;active tasks
              </>
            ) : (
              "Please login or register to view your tasks"
            )}
          </p>
        </div>

        {/* Add Task Button - Now Closer to Welcome Text */}
        <button
          className="px-6 py-2 bg-black text-white rounded-full
          hover:bg-[#FFD700] hover:text-black transition-all duration-200 ease-in-out"
          onClick={() => {
            if (userId) {
              openModalForAdd();
            } else {
              router.push("/login");
            }
          }}
        >
          {userId ? "Add a New Task" : "Login / Register"}
        </button>
      </div>
    </header>
  );
}

export default Header;
