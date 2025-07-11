import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b rounded">
      <SidebarTrigger />
      <div className="flex-grow text-center">
        <h1 className="text-2xl font-bold">TDC Dashboard</h1>
      </div>

      <div className="flex flex-row justify-between items-center ml-3"></div>
    </header>
  );
};

export default Header;
