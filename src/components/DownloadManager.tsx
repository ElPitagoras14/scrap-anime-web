"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  startDownload,
  updateDownload,
  finishDownload,
  cancelDownload,
} from "@/redux/features/downloadSlice";

const MAX_SIMULTANEOUS_DOWNLOADS = 4;

const DownloadManager: React.FC = () => {
  const { queue, downloading } = useAppSelector(
    (state) => state.downloadReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const activeDownloads = downloading;

    const startNextDownload = () => {
      if (
        queue.length > 0 &&
        activeDownloads.length < MAX_SIMULTANEOUS_DOWNLOADS
      ) {
        const nextDownload = queue[0];
        dispatch(startDownload({ id: nextDownload.id }));
        const { id, fileUrl, fileName } = nextDownload;

        axios
          .get(fileUrl, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              const { total: eventTotal, loaded } = progressEvent;
              const total = eventTotal || 1;
              const current = loaded;
              const progress = Math.floor((current / total) * 100);
              dispatch(updateDownload({ id, progress, total }));
            },
          })
          .then((response) => {
            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            const url = window.URL.createObjectURL(blob);

            link.href = url;
            link.download = fileName;
            link.click();

            window.URL.revokeObjectURL(url);
            link.remove();

            dispatch(finishDownload({ id }));
          })
          .catch((error) => {
            console.error("Error downloading the file", error);
            dispatch(cancelDownload({ id }));
            startNextDownload();
          });
      }
    };

    startNextDownload();
  }, [queue, downloading, dispatch]);

  return null;
};

export default DownloadManager;
