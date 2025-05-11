import React, { useState } from "react";
import { ProSidebar, SubMenu, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import Logo from "../../../../server/assets/TDClogo.png";

interface SidebarItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const SidebarItem = ({ title, to, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{}}
      onClick={() => setSelected(title)}
    >
      <Typography>{title}</Typography>
      <Link href={to} />
    </MenuItem>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `#ededed !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Header */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={<MenuIcon />}
            style={{ margin: "10px 0 20px 0", textAlign: "center" }}
          />
          {/* Logo and Title */}
          {!isCollapsed && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{m:5, mt:2, mb:2}}
            >
              {/* <Image src={Logo} alt="TDC Doors Logo" width={50} height={50} /> */}
              <Typography variant="h6" color="black" sx={{}}>
                THE DOOR COMPANY INC.
              </Typography>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <SubMenu title="Dasboard" icon={<DashboardIcon />}>
              <SidebarItem
                title="Dashboard"
                to="/"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu title="Products" icon={<ShoppingCartIcon />}>
              <SidebarItem
                title="Doors"
                to="/products"
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarItem
                title="Locks"
                to="/products"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu title="Customers" icon={<SupervisorAccountIcon />}>
              <SidebarItem
                title="Invoices"
                to="/invoices"
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarItem
                title="Customer Info"
                to="/customers"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu title="Books" icon={<MenuBookIcon />}></SubMenu>

            <SubMenu title="Calendar" icon={<EditCalendarIcon />}>
              <SidebarItem
                title="Measure Appointment"
                to="/customers"
                selected={selected}
                setSelected={setSelected}
              />
              <SidebarItem
                title="Installation / Delivery"
                to="/customers"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu title="Inventory" icon={<Inventory2Icon />}>
              <SidebarItem
                title="Inventory"
                to="/inventory"
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
