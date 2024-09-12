import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { isBlockedByUser } from "@/lib/block-service";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isBlockedByThisUser = await isBlockedByUser(user.id);

  if (isBlockedByThisUser) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p>Username : {user.username}</p>
      <p>UserId : {user.id}</p>
      <p>is following : {`${isFollowing}`}</p>
      <p>is blocked by this user: {`${isBlockedByThisUser}`}</p>
      <Actions userId={user.id} isFollowing={isFollowing} />
    </div>
  );
};

export default UserPage;
