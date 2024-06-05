"use client";

import { AnimeCard } from "@/components/AnimeCard";
import { Header } from "@/components/pageComponents/Header";
import { TypographyH2 } from "@/components/ui/typography";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const animeName = `'${searchParams.get("anime")}'`;
  return (
    <>
      <Header></Header>
      <main className="flex flex-col items-center py-10">
        <div className="w-[80%] space-y-8">
          <TypographyH2 className="">
            Lista de resultados para {animeName}
          </TypographyH2>
          <div className="flex flex-wrap">
            <AnimeCard
              title={"Mushoku"}
              imageSrc={
                "https://www.lokoloko.es/25468-large_default/medianoche-7546.jpg"
              }
            ></AnimeCard>
          </div>
        </div>
      </main>
    </>
  );
}
