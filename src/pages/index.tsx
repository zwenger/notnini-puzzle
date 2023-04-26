import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

const TILE_COUNT = 16;
const IMG =
  "https://media.licdn.com/dms/image/C4D22AQFDEFZhAqNbuQ/feedshare-shrink_800/0/1671392596051?e=1684368000&v=beta&t=3Up_xoi7QMAwlyDXfoflE0pZf1_qXgPjyx8DYxA3_6k";
const GRID_SIZE = Math.sqrt(TILE_COUNT);
const tilesArray = [...Array(TILE_COUNT).keys()];

type Board = {
  tiles: number[];
  img: string;
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

  return (
    <>
      <ul
        className="relative grid h-80 w-80 grid-cols-4 grid-rows-4 gap-1 p-2"
        ref={parent}
      >
        {tiles.map((tile, index) => {
          return (
            <Tile
              key={index}
              index={index}
              tile={tile}
              width={34}
              height={34}
              handleTileClick={handleTileClick}
              imgUrl={props.img}
            />
          );
        })}
      </ul>
    </>
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
        backgroundImage: `url(${IMG})`,
      }}
      className="flex items-center justify-center text-2xl font-bold"
      onClick={() => props.handleTileClick(props.index)}
    >
      <span>{`${props.tile + 1}`}</span>
    </li>
  );
};

const Home = ({
  tiles,
  img,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>Not Nini Puzzle</title>
        <meta name="description" content="NotNini Puzzle Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Board tiles={tiles} img={img} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<Board> = () => {
  const shuffledTiles = shuffleTiles(tilesArray);
  const img =
    "https://media.licdn.com/dms/image/C4D22AQFDEFZhAqNbuQ/feedshare-shrink_800/0/1671392596051?e=1684368000&v=beta&t=3Up_xoi7QMAwlyDXfoflE0pZf1_qXgPjyx8DYxA3_6k";
  return {
    props: {
      tiles: shuffledTiles,
      img,
    },
  };
};

export default Home;
