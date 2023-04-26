import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { helpers } from "../server/helpers/ssgHelper";
import Confetti from "react-confetti";

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
  const [tiles, setTiles] = useState(props.tiles);
  const [parent] = useAutoAnimate();
  const { data } = api.puzzle.getPuzzle.useQuery();
  const [send, setSend] = useState(false);
  const { mutate } = api.puzzle.solvePuzzle.useMutation();

  const hasWon = useCallback(() => {
    return tiles.every((tile, index) => {
      return tile === index;
    });
  }, [tiles]);

  useEffect(() => {
    if (hasWon()) {
      console.log("You won!");
    }
    setSend(hasWon());
  }, [tiles, hasWon]);

  const handleTileClick = (index: number) => {
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
        disabled={!send}
        className="h-12 w-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        Get it!
      </button>
      {send && <Confetti tweenDuration={150} />}
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
    >
      <span>{`${props.tile + 1}`}</span>
    </li>
  );
};

const Home = ({ tiles }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>Not Nini Puzzle</title>
        <meta name="description" content="NotNini Puzzle Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Board tiles={tiles} />
      </main>
    </>
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
