"use client";

import { DownloadCard } from "@/components/DownloadCard";
import { Header } from "@/components/pageComponents/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TypographyH2 } from "@/components/ui/typography";
import { cancelDownload, quitFromQueue } from "@/redux/features/downloadSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Download } from "@/utils/interfaces";
import { useState } from "react";

export default function Downloads() {
  const { queue, downloading } = useAppSelector(
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

  return (
    <>
      <Header></Header>
      <main className="flex flex-col items-center py-10">
        <div className="w-[60%] space-y-4">
          <TypographyH2 className="">Downloads History</TypographyH2>
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
                    description,
                    totalSize,
                    imageSrc,
                    date,
                    progress,
                  } = download || {};
                  return (
                    <DownloadCard
                      key={id}
                      anime={anime}
                      description={description}
                      imageSrc={imageSrc}
                      date={date}
                      isFinished={false}
                      progress={progress}
                      totalSize={totalSize}
                      fn={() => handleCancelDownload(id)}
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
                    description,
                    imageSrc,
                    totalSize,
                    date,
                    progress,
                  } = download || {};
                  return (
                    <DownloadCard
                      key={id}
                      anime={anime}
                      description={description}
                      imageSrc={imageSrc}
                      date={date}
                      isFinished={true}
                      progress={progress}
                      totalSize={totalSize}
                      fn={() => handleQuitFromQueue(id)}
                    ></DownloadCard>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="history">
              <AccordionTrigger>History</AccordionTrigger>
              <AccordionContent className="flex flex-col space-y-4"></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </>
  );
}
