"use client";
import React, { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications =
    inboxNotifications?.filter((notification) => !notification.readAt) || [];
  console.log(unreadNotifications);
  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 rounded-lg items-center justify-center">
        <Image
          src="/assets/icons/bell.svg"
          alt="bell | notifications"
          height={24}
          width={24}
        />
        {Number(count) > 0 && (
          <div className="absolute right-2 top-2 z-20 size-2 bg-blue-500 rounded-full " />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <LiveblocksUIConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>({user} mentioned you)</>
            ),
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 ? (
              <p className="py-2 text-center text-dark-500">
                No new notifications
              </p>
            ) : (
              unreadNotifications.map((notif) => (
                <InboxNotification
                  key={notif.id}
                  inboxNotification={notif}
                  className="bg-dark-200 text-white"
                  href={`/documents/${notif.roomId}`}
                  showActions={false}
                  kinds={{
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showActions={false}
                        showRoomName={false}
                      />
                    ),
                    textMention: (props) => (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    ),
                    $documentAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                              src={
                                (props.inboxNotification.activities[0].data
                                  .avatar as string) || ""
                              }
                              alt="avatar"
                              height={36}
                              width={36}
                              className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    ),
                  }}
                />
              ))
            )}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
