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

  solvePuzzle: publicProcedure
    .input(
      z.object({
        puzzleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const solved = await ctx.prisma.solvedPuzzle.create({
        data: {
          puzzleId: input.puzzleId,
          userId: "pepe",
        },
      });
      return solved;
    }),
});
