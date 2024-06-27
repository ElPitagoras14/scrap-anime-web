import Image from "next/image";
import { Card } from "./ui/card";
import { TypographyH6, TypographySmall } from "./ui/typography";
import { Progress } from "./ui/progress";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";

interface DownloadCardProps {
  anime: string;
  description: string;
  imageSrc: string;
  date: Date;
  isFinished: boolean;
  progress: number;
  totalSize?: number;
  fn: () => void;
}

const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${formattedSize} ${sizes[i]}`;
};

export const DownloadCard = ({
  anime,
  description,
  imageSrc,
  date,
  isFinished,
  progress,
  totalSize = 0,
  fn,
}: DownloadCardProps) => {
  const newDate = new Date(date);
  const formattedDate = format(newDate, "yyyy-MM-dd HH:mm");
  return (
    <Card>
      <div className="relative flex items-center space-x-4 p-4">
        <Image
          src={imageSrc}
          alt={""}
          width={70}
          height={70}
          className="rounded-md"
        ></Image>
        <div className="flex flex-col w-full">
          <TypographyH6>
            {anime} - {description}
          </TypographyH6>
          <TypographySmall>{formattedDate}</TypographySmall>
          <TypographySmall>
            {totalSize > 0 ? formatFileSize(totalSize) : ""}
          </TypographySmall>
          <Progress
            value={isFinished ? 100 : progress}
            className="mt-2"
            progressColor={isFinished ? "bg-accent" : "bg-primary"}
          ></Progress>
        </div>
        <Button
          className="absolute top-2 end-2 rounded-full m-0 px-1.5 py-2"
          variant="ghost"
        >
          <X className="h-7 w-7" onClick={fn}></X>
        </Button>
      </div>
    </Card>
  );
};
