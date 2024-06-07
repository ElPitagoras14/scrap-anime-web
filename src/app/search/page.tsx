"use client";

import { AnimeCard } from "@/components/AnimeCard";
import { Header } from "@/components/pageComponents/Header";
import { TypographyH2 } from "@/components/ui/typography";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Search() {
  const searchParams = useSearchParams();
  const animeName = `'${searchParams.get("anime")}'`;

  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BACKEND_URL}/api/v1/anime/search?query=${animeName}`,
    };
    setIsLoading(true);
    axios(options)
      .then((response) => {
        const {
          data: {
            payload: { items },
          },
        } = response;
        setAnimeList(items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [animeName]);

  const examplesLength = 4;
  const exampleArray = Array.from({ length: examplesLength }, (_, i) => i);

  return (
    <>
      <Header></Header>
      <main className="flex flex-col items-center py-10">
        <div className="w-[80%] space-y-8">
          <TypographyH2 className="">
            Lista de resultados para {animeName}
          </TypographyH2>
          <div className="flex flex-wrap space-x-4">
            {isLoading
              ? exampleArray.map((ex, idx) => {
                  return (
                    <div key={idx}>
                      <Skeleton className="w-[200px] h-[285px]"></Skeleton>
                      <Skeleton className="w-[200px] h-[40px] mt-4"></Skeleton>
                    </div>
                  );
                })
              : animeList.map((anime) => {
                  const {
                    title,
                    anime_id: animeId,
                    image_src: imageSrc,
                  } = anime;
                  return (
                    <AnimeCard
                      key={animeId}
                      title={title}
                      animeId={animeId}
                      imageSrc={imageSrc}
                    ></AnimeCard>
                  );
                })}
          </div>
        </div>
      </main>
    </>
  );
}
