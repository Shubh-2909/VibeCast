import { db } from "./db";
import { getSelf } from "./auth-service";

export const getFollowedUsers = async () => {
  try {
    const self = await getSelf();

    const followedUsers = db.follow.findMany({
      where: {
        followerId: self.id,
      },
      include: {
        following: true,
      },
    });

    return followedUsers;
  } catch (error) {
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return true;
    }

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not Found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followingId: otherUser.id,
      followerId: self.id,
    },
  });

  if (existingFollow) {
    throw new Error("Already Followed");
  }

  const follow = await db.follow.create({
    data: {
      followingId: otherUser.id,
      followerId: self.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  return follow;
};

export const UnfollowUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not Found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot Unfollow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followingId: otherUser.id,
      followerId: self.id,
    },
  });

  if (!existingFollow) {
    throw new Error("Not Following");
  }

  const Unfollow = await db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return Unfollow;
};
