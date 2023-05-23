import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { helpers } from "../server/helpers/ssgHelper";
import Confetti from "react-confetti";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const TILE_COUNT = 16;
const GRID_SIZE = Math.sqrt(TILE_COUNT);
const tilesArray = [...Array(TILE_COUNT).keys()];

type Board = {
  tiles: number[];
};
const swap = (tiles: number[], src: number, dest: number) => {
  const tilesResult = [...tiles];

  const tempSrc = tilesResult[src];
  const tempDest = tilesResult[dest];

  if (tempSrc === undefined || tempDest === undefined) return tilesResult;

  [tilesResult[src], tilesResult[dest]] = [tempDest, tempSrc];

  return tilesResult;
};

const shuffleTiles = (tiles: number[]) => {
  let shuffledTiles = [...tiles];
  for (let i = shuffledTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    shuffledTiles = swap(shuffledTiles, i, j);
  }
  return shuffledTiles;
};

const Board = (props: Board) => {
  const { isSignedIn } = useUser();

  const [tiles, setTiles] = useState(props.tiles);
  const [parent] = useAutoAnimate();
  const { data } = api.puzzle.getPuzzle.useQuery();
  const [send, setSend] = useState(false);
  const { mutate } = api.puzzle.solvePuzzle.useMutation();
  const [confetti, setConfetti] = useState(true);

  const hasWon = useCallback(() => {
    return tiles.every((tile, index) => {
      return tile === index;
    });
  }, [tiles]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (hasWon()) {
      console.log("You won!");
      timeout = setTimeout(() => {
        setConfetti(false);
      }, 5000);
    }
    setSend(hasWon());
    setConfetti(hasWon());
    return () => clearTimeout(timeout);
  }, [tiles, hasWon]);

  const handleTileClick = (index: number) => {
    if (!isSignedIn) {
      toast.error("Sign in to play!");
      return;
    }
    swapTiles(index);
  };

  const swapTiles = (tileIndex: number) => {
    if (canSwap(tileIndex, tiles.indexOf(tiles.length - 1))) {
      const swappedTiles = swap(
        tiles,
        tileIndex,
        tiles.indexOf(tiles.length - 1)
      );
      setTiles(swappedTiles);
    }
  };

  const canSwap = (srcIndex: number, destIndex: number) => {
    const { row: srcRow, col: srcCol } = getMatrixPosition(srcIndex);
    const { row: destRow, col: destCol } = getMatrixPosition(destIndex);
    return Math.abs(srcRow - destRow) + Math.abs(srcCol - destCol) === 1;
  };

  const getMatrixPosition = (index: number) => {
    return {
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    };
  };

  const swap = (tiles: number[], src: number, dest: number) => {
    const tilesResult = [...tiles];

    const tempSrc = tilesResult[src];
    const tempDest = tilesResult[dest];

    if (tempSrc === undefined || tempDest === undefined) return tilesResult;

    [tilesResult[src], tilesResult[dest]] = [tempDest, tempSrc];

    return tilesResult;
  };

  if (!data) return <div>No challenge</div>;

  return (
    <div className="flex flex-col items-center gap-8 ">
      <ul
        className=" grid h-full w-[80vw] max-w-[500px] grid-cols-4 grid-rows-4 gap-1 p-2"
        ref={parent}
      >
        {tiles.map((tile, index) => {
          return (
            <Tile
              key={index}
              index={index}
              tile={tile}
              width={40}
              height={40}
              handleTileClick={handleTileClick}
              imgUrl={data.puzzleImg}
            />
          );
        })}
      </ul>

      <button
        ref={parent}
        onClick={() => {
          mutate({ puzzleId: data.id });
        }}
        disabled={!send || !isSignedIn}
        className="h-12 w-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        Get it!
      </button>
      {send && confetti && <Confetti tweenDuration={150} />}
    </div>
  );
};

const Tile = (props: {
  tile: number;
  index: number;
  width: number;
  height: number;
  handleTileClick: (index: number) => void;
  imgUrl: string;
}) => {
  return (
    <li
      style={{
        opacity: props.tile === TILE_COUNT - 1 ? 0 : 1,
        backgroundPosition: `${
          (100 / (GRID_SIZE - 1)) * (props.tile % GRID_SIZE)
        }% ${(100 / (GRID_SIZE - 1)) * Math.floor(props.tile / GRID_SIZE)}%`,
        backgroundSize: `${GRID_SIZE * 100}%`,
        backgroundImage: `url(${props.imgUrl})`,
      }}
      className="flex aspect-square items-center justify-center text-2xl font-bold"
      onClick={() => props.handleTileClick(props.index)}
    ></li>
  );
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  tiles,
}) => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex h-screen flex-col  justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Head>
        <title>Not Nini Puzzle</title>
        <meta name="description" content="NotNini Puzzle Game 🎲" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="opacity-85 border-b-1 h-auto min-h-[50px] items-start border-black p-2 shadow-lg">
        {!isSignedIn ? (
          <SignInButton>
            <button className="w-auto rounded bg-[#9B42F3] px-4 py-2 font-bold text-white hover:bg-[#9b42f3ae] disabled:bg-gray-400">
              Sign in
            </button>
          </SignInButton>
        ) : (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 40,
                  height: 40,
                },
              },
            }}
          />
        )}
      </nav>
      <main className="mb-auto flex w-screen flex-col items-center justify-center pt-6  ">
        <Board tiles={tiles} />
      </main>
      <footer className="flex items-start justify-between p-4 text-xl text-white">
        <a href="https://github.com/zwenger/notnini-puzzle">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <div>Github</div>
          </div>
        </a>
        <a href="https://github.com/zwenger/notnini-puzzle">
          <div className="flex items-center justify-center gap-2">
            <svg
              width="24"
              height="24"
              fill="black"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path fill-rule="evenodd" d="M256,48,496,464H16Z"></path>
              </g>
            </svg>
            <div>Powered by Vercel</div>
          </div>
        </a>
      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Board> = async () => {
  // const shuffledTiles = shuffleTiles(tilesArray);
  const shuffledTiles = tilesArray;

  await helpers.puzzle.getPuzzle.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      tiles: shuffledTiles,
    },
    revalidate: 3600,
  };
};

export default Home;
