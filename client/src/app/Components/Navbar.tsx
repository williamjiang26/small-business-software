"use client";
import Link from "../../../node_modules/next/link";
import Image from "../../../node_modules/next/image";
import { Button } from "@/components/ui/button";
import LOGO from "../../assets/TDClogo.png";

const Navbar = () => {
  const isDashboardPage = false;
  const authUser = false;
  return (
    <div
      className=" fixed bg-black top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${58}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8  text-white">
        <div className="flex items-center gap-4 md:gap-6">

          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src={LOGO}
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-xl font-bold">TDC</div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 font-light hover:!text-primary-300"
              onClick={() => {}}
            >
              dd
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <p className="text-primary-200 hidden md:block"></p>
        )}
        <div className="flex items-center gap-5">
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg "
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg "
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
