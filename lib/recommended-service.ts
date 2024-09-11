import { db } from "./db";
import { getSelf } from "./auth-service";
import { resolve } from "path";

export const getRecommended = async () => {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};
