import React from "react";
import { github } from "@/utils/icons"; // Import your GitHub logo
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full fixed bottom-0 left-0 z-10 flex justify-center py-6 gap-6">
      {/* Meet Our Developer Button (Smaller Size) */}
      <Link
        href="https://shakesdeveloper.netlify.app/"
        passHref
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 text-sm text-white bg-[#000000] rounded-[20px] hover:bg-[#FFD700] hover:text-black transition-all duration-200 ease-in-out"
      >
        Meet Our Developer
      </Link>

      {/* GitHub Link */}
      <Link
        href="https://github.com/Shakespro"
        passHref
        target="_blank"
        rel="noopener noreferrer"
        className="h-[40px] w-[40px] text-purple-500 flex items-center justify-center text-lg border-2 border-[#E6E6E6] rounded-full"
      >
        {github}
      </Link>
    </footer>
  );
}

export default Footer;
