import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const puzzleRouter = createTRPCRouter({
  getPuzzle: publicProcedure.query(({ ctx }) =>
    ctx.prisma.puzzle.findFirstOrThrow({
      where: {
        available: {
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
