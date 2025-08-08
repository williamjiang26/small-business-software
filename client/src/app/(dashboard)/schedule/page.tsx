import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const page = () => {
  return (
    <div>
      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="ordersInStock">Orders in stock</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule">schedule</TabsContent>
        <TabsContent value="ordersInStock"> products in stock</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
