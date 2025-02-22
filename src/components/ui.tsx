"use client";

import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "test",
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0]!,
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i]!,
    back: pictures[i + 1]!,
  });
}

pages.push({
  front: pictures[pictures.length - 1]!,
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className="pointer-events-none fixed inset-0 z-10 flex select-none flex-col justify-between">
        <div className="pointer-events-auto flex w-full justify-center overflow-auto">
          <div className="flex max-w-full items-center gap-4 overflow-auto p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`shrink-0 rounded-full border border-transparent px-4 py-3 text-lg uppercase transition-all duration-300 hover:border-white ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            <button
              className={`shrink-0 rounded-full border border-transparent px-4 py-3 text-lg uppercase transition-all duration-300 hover:border-white ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
