"use client";

import { DownloadCard } from "@/components/DownloadCard";
import { Header } from "@/components/pageComponents/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { TypographyH2, TypographyH5 } from "@/components/ui/typography";
import {
  cancelDownload,
  quitFromQueue,
  setIsPaused,
  setReadyDownload,
} from "@/redux/features/downloadSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Download } from "@/utils/interfaces";
import { useState } from "react";

export default function Downloads() {
  const { queue, downloading, isPaused, browserUse } = useAppSelector(
    (state: { downloadReducer: any }) => state.downloadReducer
  );
  const dispatch = useAppDispatch();

  const [showQueue, setShowQueue] = useState<Download[]>(queue);
  const [showDownloading, setShowDownloading] =
    useState<Download[]>(downloading);

  setInterval(() => {
    const storedData = localStorage.getItem("persist:download");
    if (!storedData) return;
    const parsedStoredData = JSON.parse(storedData);
    const deepParseState = {
      queue: JSON.parse(parsedStoredData.queue),
      downloading: JSON.parse(parsedStoredData.downloading),
    };
    setShowQueue(deepParseState.queue);
    setShowDownloading(deepParseState.downloading);
  }, 500);

  const handleCancelDownload = (id: string) => {
    dispatch(cancelDownload({ id }));
  };

  const handleQuitFromQueue = (id: string) => {
    dispatch(quitFromQueue({ id }));
  };

  const handlePlayDownload = (id: string) => {
    const currDownload = showQueue.find((d) => d.id === id);
    if (!currDownload) return;
    dispatch(setReadyDownload({ id }));
  };

  return (
    <>
      <Header></Header>
      <main className="flex flex-col items-center py-10">
        <div className="w-[60%] space-y-4">
          <div className="flex justify-between items-center">
            <TypographyH2>Downloads</TypographyH2>
            <div className="flex space-x-4 items-center">
              <Switch
                disabled={browserUse}
                checked={isPaused}
                onCheckedChange={(checked) => {
                  dispatch(setIsPaused(checked));
                }}
              ></Switch>
              <TypographyH5>Pause</TypographyH5>
            </div>
          </div>
          <Accordion type="multiple">
            <AccordionItem value="downloading">
              <AccordionTrigger>
                Downloading ({showDownloading.length})
              </AccordionTrigger>
              <AccordionContent className="flex flex-col space-y-4">
                {showDownloading.map((download) => {
                  const {
                    id,
                    anime,
                    title,
                    totalSize,
                    imageSrc,
                    date,
                    progress,
                  } = download || {};
                  return (
                    <DownloadCard
                      key={id}
                      anime={anime}
                      title={title}
                      imageSrc={imageSrc}
                      date={date}
                      isFinished={false}
                      progress={progress}
                      totalSize={totalSize}
                      deleteFn={() => handleCancelDownload(id)}
                      isReady
                    ></DownloadCard>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="queue">
              <AccordionTrigger>Queue ({showQueue.length})</AccordionTrigger>
              <AccordionContent className="flex flex-col space-y-4">
                {showQueue.map((download) => {
                  const {
                    id,
                    anime,
                    title,
                    imageSrc,
                    totalSize,
                    date,
                    progress,
                  } = download || {};
                  const isReady = showQueue.find((d) => d.id === id)?.isReady;
                  return (
                    <DownloadCard
                      key={id}
                      anime={anime}
                      title={title}
                      imageSrc={imageSrc}
                      date={date}
                      isFinished={false}
                      progress={progress}
                      totalSize={totalSize}
                      deleteFn={() => handleQuitFromQueue(id)}
                      playFn={() => handlePlayDownload(id)}
                      isReady={isReady}
                    ></DownloadCard>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </>
  );
}
