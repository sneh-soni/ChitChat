import moment from "moment";

const fileFormat = (url = "") => {
  const fileExtention = url.split(".").pop();

  if (
    fileExtention === "mp4" ||
    fileExtention === "webm" ||
    fileExtention === "ogg"
  ) {
    return "video";
  }
  if (fileExtention === "mp3" || fileExtention === "wav") {
    return "audio";
  }
  if (
    fileExtention === "png" ||
    fileExtention === "jpg" ||
    fileExtention === "jpeg" ||
    fileExtention === "gif"
  ) {
    return "image";
  }

  return "file";
};

const transformImage = (url = "", width = 150) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const day = currentDate.clone().subtract(i, "days").format("dddd");
    last7Days.unshift(day);
  }
  return last7Days;
};

const getOrSaveFromLocalStorage = ({ key, value, get }) => {
  if (get) {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export { fileFormat, transformImage, getLast7Days, getOrSaveFromLocalStorage };
