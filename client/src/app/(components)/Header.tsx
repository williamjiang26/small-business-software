import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetAuthUserQuery } from "@/state/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "aws-amplify/auth";
import { Settings } from "lucide-react";
import Link from "../../../node_modules/next/link";
import { usePathname, useRouter } from "../../../node_modules/next/navigation";

const Header = () => {
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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* <h1 className="text-base font-medium">Header</h1> */}

        <div className="ml-auto flex items-center gap-2 rounded-lg shadow-md">
          {authUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className=" flex flex-row items-center space-x-1 "> <p className="text-primary-200 hidden md:block">
                    {authUser.cognitoInfo?.username}
                  </p>
                  <Avatar className="border-2 bg-gray">
                    {/* <AvatarImage src={authUser.userInfo?.image} /> */}
                    <AvatarFallback className="bg-white text-black">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                 
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold"
                    onClick={() => router.push("/", { scroll: false })}
                  >
                    Go to Login Page
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
          <Link
            href={`/settings`}
            // rel="noopener noreferrer"/
            target="_blank"
            className="dark:text-foreground"
          >
            <Button variant="ghost" className="hidden sm:flex ">
              <Settings className="w-4 h-4" />
            </Button>{" "}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
