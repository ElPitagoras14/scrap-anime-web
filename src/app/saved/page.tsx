"use client";

import { AnimeCard } from "@/components/AnimeCard";
import { Header } from "@/components/pageComponents/Header";
import { TypographyH2 } from "@/components/ui/typography";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";

export default function Saved() {
  const { saved } = useAppSelector((state) => state.saveReducer);
  const [showSaved] = useState(saved);
  const savedArray = Object.keys(showSaved);
  return (
    <>
      <Header></Header>
      <main className="flex flex-col items-center py-10">
        <div className="w-[80%] space-y-8">
          <TypographyH2 className="">Your saved</TypographyH2>
          <div className="flex flex-wrap space-x-4">
            {savedArray.map((savedId) => {
              const { title, imageSrc, animeId } = showSaved[savedId];
              return (
                <AnimeCard
                  key={animeId}
                  title={title}
                  imageSrc={imageSrc}
                  animeId={animeId}
                ></AnimeCard>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
