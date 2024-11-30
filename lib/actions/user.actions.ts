"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const clerk = await clerkClient();
    const { data } = await clerk.users.getUserList({
      emailAddress: userIds,
    });
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email == email)
    );
    return parseStringify(sortedUsers);
  } catch (error) {
    console.log("Error retrieving users: ", error);
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string | undefined;
  text: string;
}) => {
  try {
    if (!currentUser) return [];
    const room = await liveblocks.getRoom(roomId);
    const users = Object.keys(room.usersAccesses).filter(
      (email) => email != currentUser
    );

    if (text.length) {
      const filteredUsers = users.filter((u) =>
        u.toLowerCase().includes(text.toLowerCase())
      );
      return parseStringify(filteredUsers);
    }
    return parseStringify(users);
  } catch (err) {
    console.log("Error retrieving document users: ", err);
  }
};
