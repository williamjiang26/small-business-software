"use client";
import Link from "../../../node_modules/next/link";
import Image from "../../../node_modules/next/image";
import { Button } from "@/components/ui/button";
import LOGO from "../../assets/TDClogo.png";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import { usePathname, useRouter } from "../../../node_modules/next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "./Header";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  // const isDashboardPage =
  //   pathname.includes("/manager") || pathname.includes("/sales");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

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
              {/* <Image
                src={LOGO}
                alt="TDC Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              /> */}
              <div className="text-xl font-bold">TDC</div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row items-center space-x-1 ">
                  {" "}
                  <p className="text-primary-200 hidden md:block">
                    {authUser.userInfo?.name}
                  </p>
                  <Avatar>
                    {/* <AvatarImage src={authUser.userInfo?.image} /> */}
                    <AvatarFallback className="bg-white text-black font-semibold">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/manager/dashboard"
                          : "/sales/dashboard",
                        { scroll: false }
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 "
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
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
