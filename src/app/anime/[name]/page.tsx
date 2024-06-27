"use client";

import Image from "next/image";
import { Header } from "@/components/pageComponents/Header";
import {
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographySmall,
} from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EpisodeInfo } from "@/components/EpisodeInfo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { addToQueue } from "@/redux/features/downloadSlice";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { unsaveAnime, saveAnime } from "@/redux/features/saveSlice";
import { Bookmark } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface AnimeInfo {
  name: string;
  finished: boolean;
  description: string;
  image_src: string;
}

export default function AnimeDetail({ params }: { params: { name: string } }) {
  const { name: animeId } = params;
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo>({
    name: "",
    finished: false,
    description: "",
    image_src: "",
  });
  const { name, finished, description, image_src: imageSrc } = animeInfo || {};
  const [streamingLinks, setStreamingLinks] = useState([]);

  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { saved } = useAppSelector((state) => state.saveReducer);
  const [isSaved, setIsSaved] = useState<boolean>(
    saved.hasOwnProperty(animeId)
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const [range, setRange] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    setIsLoadingEpisodes(true);

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BACKEND_URL}/api/v1/anime/info/${animeId}`,
    };
    axios(options)
      .then((response) => {
        const {
          data: { payload },
        } = response;
        setAnimeInfo(payload);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const streamingLinkOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BACKEND_URL}/api/v1/anime/streamlinks/${animeId}`,
    };
    axios(streamingLinkOptions)
      .then((response) => {
        const {
          data: {
            payload: { episodes },
          },
        } = response;
        setStreamingLinks(episodes);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setIsLoadingEpisodes(false);
      });
  }, [animeId]);

  const examplesLength = 8;
  const exampleArray = Array.from({ length: examplesLength }, (_, i) => i);

  const downloadRange = () => {
    setIsLoadingDownload(true);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BACKEND_URL}/api/v1/anime/downloadlinks/range`,
      params: {
        episode_range: range,
      },
      data: streamingLinks,
    };

    toast({
      title: "Download request",
      description: `Episodes ${range}.`,
    });

    axios(options)
      .then((response) => {
        const {
          data: {
            payload: { episodes },
          },
        } = response;
        episodes.forEach((episode: any) => {
          const { name, link, episode_id: episodeId } = episode;
          dispatch(
            addToQueue({
              id: uuidv4(),
              fileUrl: link,
              fileName: `${animeId} - Episode ${episodeId}.mp4`,
              date: new Date(),
              anime: animeId,
              episodeId,
              description: name,
              imageSrc,
              progress: 0,
            })
          );
        });
        toast({
          title: `Downloading episodes`,
          description: `Episodes ${range}.`,
        });
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setIsLoadingDownload(false);
      });
  };

  return (
    <>
      <Header></Header>
      <main className="flex justify-center">
        <div className="grid grid-cols-4 py-10 space-x-24 px-12">
          {isLoading ? (
            <div className="flex flex-col space-y-4 text-center">
              <Skeleton className="w-[300px] h-[427px]"></Skeleton>
              <Skeleton className="w-[300px] h-[50px]"></Skeleton>
              <div className="pt-1">
                <Skeleton className="w-[300px] h-[30px]"></Skeleton>
                <Skeleton className="w-[300px] h-[80px] mt-4"></Skeleton>
              </div>
            </div>
          ) : (
            <div className="relative hover:cursor-pointer flex flex-col  text-center">
              <Image
                src={imageSrc}
                alt={""}
                width={300}
                height={300}
                className="rounded-md self-center"
              ></Image>
              <div
                className="absolute top-0 end-5 pt-[0.3rem] px-[0.2rem] m-1 rounded-md bg-[#020817]/80 hover:cursor-pointer mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSaved) {
                    dispatch(
                      unsaveAnime({
                        animeId,
                      })
                    );
                    toast({
                      title: `${name} removed from saved`,
                    });
                  } else {
                    dispatch(
                      saveAnime({
                        title: name,
                        imageSrc,
                        animeId,
                      })
                    );
                    toast({
                      title: `${name} added to saved`,
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
              <div className="rounded-md bg-accent w-full mt-4">
                <TypographyH3 className="text-center py-3">
                  {finished ? "Finalizado" : "En emisión"}
                </TypographyH3>
              </div>
              <div className="px-2 pt-1 mt-6">
                <TypographyH4>{name}</TypographyH4>
                <TypographySmall className="text-start">
                  {description}
                </TypographySmall>
              </div>
            </div>
          )}
          <div className="col-span-3 h-[500px]">
            <div className="flex justify-between items-center pt-2 pb-4 pl-6 pr-4">
              <TypographyH3>Episodios</TypographyH3>
              <div className="flex space-x-4">
                <Input
                  placeholder="1-5,7,8-10,12"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                />
                <Button
                  size="default"
                  variant="secondary"
                  disabled={isLoading || !range || isLoadingDownload}
                  onClick={downloadRange}
                >
                  {isLoadingDownload && (
                    <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
                  )}
                  <TypographyH5 className="font-normal">Descargar</TypographyH5>
                </Button>
              </div>
            </div>
            <Separator></Separator>
            {isLoadingEpisodes ? (
              <ScrollArea className="h-[70vh] border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Id</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                {exampleArray.map((ex, idx) => {
                  return (
                    <div key={idx} className="mb-4 mt-4 flex justify-center">
                      <Skeleton className="w-[98%] px-4 h-[30px]"></Skeleton>
                    </div>
                  );
                })}
              </ScrollArea>
            ) : (
              <ScrollArea className="h-[70vh] border rounded-md mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Id</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {streamingLinks.map((episode) => {
                      const { name, link, episode_id: episodeId } = episode;
                      return (
                        <EpisodeInfo
                          key={episodeId}
                          episodeId={episodeId}
                          description={name}
                          anime={animeId}
                          imageSrc={imageSrc}
                          streamingLink={link}
                        ></EpisodeInfo>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
