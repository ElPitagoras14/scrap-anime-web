"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  startDownload,
  updateDownload,
  finishDownload,
  cancelDownload,
  quitFromQueue,
} from "@/redux/features/downloadSlice";

const DownloadManager: React.FC = () => {
  const {
    queue,
    downloading,
    browserUse,
    automaticDownload,
    maxConcurrentDownloads,
    isPaused,
  } = useAppSelector((state) => state.downloadReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const startNextDownload = () => {
      if (queue.length === 0) {
        return;
      }
      if (automaticDownload && downloading.length >= maxConcurrentDownloads) {
        return;
      }

      const readyDownloads = automaticDownload
        ? queue
        : queue.filter((d) => d.isReady);

      if (readyDownloads.length === 0) {
        return;
      }

      const nextDownload = readyDownloads[0];

      const { id, fileUrl, fileName } = nextDownload;

      if (browserUse) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", fileName || "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(quitFromQueue({ id }));
        return;
      }

      dispatch(startDownload({ id }));

      axios
        .get(fileUrl, {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { total: eventTotal, loaded } = progressEvent;
            const total = eventTotal || 1;
            const current = loaded;
            const progress = parseFloat(((current / total) * 100).toFixed(2));
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
    };

    startNextDownload();
  }, [
    queue,
    downloading,
    browserUse,
    automaticDownload,
    maxConcurrentDownloads,
    dispatch,
    isPaused,
  ]);

  return null;
};

export default DownloadManager;
