import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const IMG =
  "https://media.licdn.com/dms/image/C4D22AQFDEFZhAqNbuQ/feedshare-shrink_800/0/1671392596051?e=1684368000&v=beta&t=3Up_xoi7QMAwlyDXfoflE0pZf1_qXgPjyx8DYxA3_6k";
const TILE_COUNT = 16;
const GRID_SIZE = Math.sqrt(TILE_COUNT);

const Board = () => {
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
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

  function getMatrixPosition(index: number) {
    return {
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    };
  }

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
              imgUrl={""}
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
      className="flex items-center justify-center bg-red-300 text-2xl font-bold"
      onClick={() => props.handleTileClick(props.index)}
    >
      <span>{!props.imgUrl && `${props.tile + 1}`}</span>
    </li>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Not Nini Puzzle</title>
        <meta name="description" content="NotNini Puzzle Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Board />
      </main>
    </>
  );
};

export default Home;
