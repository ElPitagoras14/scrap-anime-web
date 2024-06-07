"use client";

import { Bookmark } from "lucide-react";
import Image from "next/image";
import { TypographyH5 } from "./ui/typography";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { saveAnime, unsaveAnime } from "@/redux/features/saveSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AnimeCardProps {
  title: string;
  imageSrc: string;
  animeId: string;
}

export const AnimeCard = ({ title, imageSrc, animeId }: AnimeCardProps) => {
  const { saved } = useAppSelector((state) => state.saveReducer);
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState<boolean>(
    saved.hasOwnProperty(animeId)
  );
  const [showBookmark, setShowBookmark] = useState<boolean>(false);

  useEffect(() => {
    setShowBookmark(isSaved);
  }, [isSaved]);

  return (
    <div
      className="relative hover:cursor-pointer w-[200px] mb-4"
      onClick={() => {
        router.push(`/anime/${animeId}`);
      }}
      onMouseEnter={() => {
        if (!isSaved) {
          setShowBookmark(true);
        }
      }}
      onMouseLeave={() => {
        if (!isSaved) {
          setShowBookmark(false);
        }
      }}
    >
      <Image
        src={imageSrc}
        alt={""}
        width={200}
        height={200}
        className="rounded-md"
      ></Image>
      <div
        className={`absolute top-0.5 end-0.5 pt-[0.3rem] px-[0.2rem] m-1 rounded-md ${
          showBookmark ? "bg-[#020817]/80" : "hidden"
        } hover:cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          if (isSaved) {
            dispatch(
              unsaveAnime({
                animeId,
              })
            );
            toast({
              title: `${title} removed from saved`,
            });
          } else {
            dispatch(
              saveAnime({
                title,
                imageSrc,
                animeId,
              })
            );
            toast({
              title: `${title} added to saved`,
            });
          }
          setIsSaved(!isSaved);
        }}
      >
        <TooltipProvider>
          <Tooltip>
            {isSaved ? (
              <>
                <TooltipTrigger>
                  <Bookmark
                    fill="hsl(var(--primary))"
                    className="h-6 w-6 text-primary"
                  ></Bookmark>
                </TooltipTrigger>
                <TooltipContent>Remove from saved</TooltipContent>
              </>
            ) : (
              <>
                <TooltipTrigger>
                  <Bookmark className="h-6 w-6 text-white"></Bookmark>
                </TooltipTrigger>
                <TooltipContent>Add to saved</TooltipContent>
              </>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <TypographyH5 className="text-center mt-4 text-wrap">
        {title}
      </TypographyH5>
    </div>
  );
};
