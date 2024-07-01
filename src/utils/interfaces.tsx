export interface Download {
  id: string;
  isReady: boolean;
  fileUrl: string;
  fileName: string;
  date: Date;
  anime: string;
  episodeId: number;
  title: string;
  imageSrc: string;
  progress: number;
  totalSize?: number;
}

export interface Saved {
  animeId: string;
  name: string;
  imageSrc: string;
}
