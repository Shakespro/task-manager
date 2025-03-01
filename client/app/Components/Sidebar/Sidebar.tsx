import React from "react";
import Profile from "../Profile/Profile";
import RadialChart from "../RadialChart/RadialChart";
import { useUserContext } from "@/context/userContext";

function Sidebar() {
  const { logoutUser } = useUserContext();

  return (
    <div className="w-[20rem] h-full fixed right-0 top-0 bg-[#f9f9f9] flex flex-col overflow-y-auto z-50"> {/* Increased z-index */}
      <Profile />
      <div className="mt-4 mx-6 flex-grow">
        <RadialChart />
      </div>

      <div className="flex-shrink-0"> {/* Ensure button doesn't shrink */}
        <button
          className="mt-4 mb-6 mx-6 py-4 px-8 bg-[#000000] text-white rounded-[50px] hover:bg-[#FFD700] hover:text-black transition duration-200 ease-in-out"
          onClick={logoutUser}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
