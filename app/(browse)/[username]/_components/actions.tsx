"use client";

import { onBlock, onUnBlock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("something went wrong"));
    });
  };

  const handleUnFollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("something went wrong"));
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnFollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) =>
          toast.success(`Blocked the user ${data.blocked.username}`)
        )
        .catch(() => toast.error("something went wrong"));
    });
  };

  const handleUnBlock = () => {
    startTransition(() => {
      onUnBlock(userId)
        .then((data) =>
          toast.success(`Unblocked the user ${data.blocked.username}`)
        )
        .catch(() => toast.error("something went wrong"));
    });
  };

  return (
    <>
      <Button onClick={onClick} variant="primary" disabled={isPending}>
        {isFollowing ? "UnFollow" : "Follow"}
      </Button>
      <Button onClick={handleUnBlock} disabled={isPending}>
        UnBlock
      </Button>
    </>
  );
};
