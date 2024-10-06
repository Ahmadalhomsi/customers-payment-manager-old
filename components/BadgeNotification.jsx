"use client";
import React, { useState } from "react";
import { Badge, Avatar, Switch, Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon";

// Example notification data
const notifications = [
  { id: 1, message: "New message from John", time: "5 min ago" },
  { id: 2, message: "You have a new follower", time: "1 hour ago" },
  { id: 3, message: "Your post was liked by Sarah", time: "2 hours ago" },
  { id: 4, message: "Meeting reminder: Team sync at 3 PM", time: "3 hours ago" },
  { id: 5, message: "New comment on your photo", time: "1 day ago" },
];

export function BadgeNotification() {
  const [isInvisible, setIsInvisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Popover placement="bottom" isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <PopoverTrigger>
            <div className="cursor-pointer flex items-center">
              <Badge style={{ backgroundColor: "#f26000" }} content={notifications.length} isInvisible={isInvisible} shape="circle">
                <NotificationIcon className="fill-current" size={30} />
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <h3 className="text-lg font-bold mb-2">Notifications</h3>
              {notifications.map((notification) => (
                <div key={notification.id} className="mb-2 p-2 hover:bg-gray-100 rounded">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
              <Button size="sm" className="mt-2 w-full">View All</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Switch isSelected={!isInvisible} onValueChange={(value) => setIsInvisible(!value)}>
      </Switch>
    </div>
  );
}
