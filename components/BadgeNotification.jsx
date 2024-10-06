"use client"
import React from "react";
import { Badge, Avatar, Switch } from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon";


export function BadgeNotification() {
    const [isInvisible, setIsInvisible] = React.useState(false);

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <Badge style={{backgroundColor:"#f26000"}} content={5} isInvisible={isInvisible} shape="circle">
                    <NotificationIcon className="fill-current" size={30} />
                </Badge>
            </div>
            <Switch isSelected={!isInvisible} onValueChange={(value) => setIsInvisible(!value)}>
            </Switch>
        </div>
    );
}
