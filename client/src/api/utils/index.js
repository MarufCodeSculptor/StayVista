import axios from "axios";

const imageBBKey = import.meta.env.VITE_imagebb_key;
const imageHostAPI = `https://api.imgbb.com/1/upload?key=${imageBBKey}`;

export const postImage = async (image) => {
  const imageData = new FormData();
  imageData.append("image", image);

  const { data } = await axios.post(imageHostAPI, imageData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return data.data.display_url;
};
