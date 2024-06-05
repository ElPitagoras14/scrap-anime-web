import { Bookmark } from "lucide-react";
import Image from "next/image";
import { TypographyH5 } from "./ui/typography";

interface AnimeCardProps {
  title: string;
  imageSrc: string;
}

export const AnimeCard = ({ title, imageSrc }: AnimeCardProps) => {
  return (
    <div className="relative">
      <Image
        src={imageSrc}
        alt={""}
        width={200}
        height={200}
        className="rounded-md"
      ></Image>
      <div className="absolute top-0.5 end-0.5 p-2 rounded-full hover:bg-background/70 hover:cursor-pointer">
        <Bookmark
          fill="hsl(var(--primary))"
          className="h-6 w-6 text-primary"
        ></Bookmark>
      </div>
      <TypographyH5 className="text-center mt-4">{title}</TypographyH5>
    </div>
  );
};
