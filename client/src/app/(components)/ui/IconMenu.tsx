import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MenuIconProps {
  icon: ReactNode;
  text: string;
  className?: string;
}
const IconMenu = ({ icon, text, className }: MenuIconProps) => {
  return (
    <div
      className={cn(
        "flex flex-row text-center items-center justify-center space-x-2",
        className
      )}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default IconMenu;
