import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen ">
      <Head>
        <title>Not Nini Puzzle</title>
        <meta name="description" content="NotNini Puzzle Game 🎲" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{ backgroundImage: "url('/splash_art_lofi.png')" }}
        className="flex w-3/5 items-center justify-center bg-cover bg-center opacity-90"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="under text-6xl font-extrabold text-white">NotNini</h1>
          <h2 className="text-3xl font-black text-[#a031f0] overline  ">
            Puzzle
          </h2>
        </div>
      </div>
      <div className="relative flex w-2/5 flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] p-2 text-center ">
        <h1 className="text-3xl font-bold text-white sm:text-5xl">
          Tired of coding?
        </h1>
        <h2 className="text-md text-white">Try out our new mini-game!</h2>
        <Link
          href="/game"
          className=" w-auto animate-pulse rounded bg-[#a031f0] px-4 py-2 font-sans font-bold text-white hover:bg-blue-700 "
        >
          Play Now!
        </Link>
        <p className="mt-6 text-center font-serif text-lg text-white">
          Solve puzzles and get new profile images for our platform...
        </p>
        <footer className="absolute bottom-0  flex w-full flex-col items-center gap-2 p-4 text-sm text-white sm:flex-row sm:justify-between ">
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
    </div>
  );
};

export default Home;
