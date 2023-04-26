import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

import { createServerSideHelpers } from "@trpc/react-query/server";

export const helpers = createServerSideHelpers({
  router: appRouter,
  ctx: { prisma },
  transformer: superjson,
});
