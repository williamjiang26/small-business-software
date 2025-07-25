import React from "react";
import DashboardWrapper from "../dashboardWrapper";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default DashboardLayout;
