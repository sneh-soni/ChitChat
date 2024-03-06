import { FileOpen } from "@mui/icons-material";
import React from "react";
import { transformImage } from "../../utils/features";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="attachment"
          width={"800px"}
          height={"800px"}
          style={{ objectFit: "contain" }}
        />
      );

    case "audio":
      return <audio src={url} preload="none" controls />;

    default:
      return <FileOpen />;
  }
};

export default RenderAttachment;
