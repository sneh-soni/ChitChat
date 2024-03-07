import { FileOpen } from "@mui/icons-material";
import React from "react";
import { transformImage } from "../../utils/features";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return (
        <video
          style={{ width: "100%" }}
          src={url}
          preload="none"
          width={"200px"}
          controls
        />
      );
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="attachment"
          style={{
            objectFit: "contain",
            width: "100%",
          }}
        />
      );

    case "audio":
      return (
        <audio style={{ width: "100%" }} src={url} preload="none" controls />
      );

    default:
      return <FileOpen />;
  }
};

export default RenderAttachment;
