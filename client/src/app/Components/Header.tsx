import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white text-black border-b rounded">
      <div className="flex-grow text-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>
      
      <div className="flex flex-row justify-between items-center ml-3">
      </div>
    </header>
  );
};

export default Header;
