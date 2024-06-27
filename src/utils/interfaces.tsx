export interface Download {
  id: string;
  fileUrl: string;
  fileName: string;
  date: Date;
  anime: string;
  episodeId: number;
  description: string;
  imageSrc: string;
  progress: number;
  totalSize?: number;
}

export interface Saved {
  animeId: string;
  title: string;
  imageSrc: string;
}
