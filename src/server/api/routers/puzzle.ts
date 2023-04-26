import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const puzzleRouter = createTRPCRouter({
  getPuzzle: publicProcedure.query(({ ctx }) =>
    ctx.prisma.puzzle.findFirstOrThrow({
      where: {
        available: {
          lte: new Date(new Date().setHours(23, 59, 59, 0)),
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })
  ),
});
