import axios from "axios";

// Для разработки
export const getDataIGS = async () => {
  return await axios.get("/igs-api/pub/station/general/IGSNetwork.json")
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      throw new Error(error);
    });
};

// Для продакшена
// export const getDataIGS = async () => {
//     return await axios.get("/igs-api/pub/station/general/IGSNetwork.json")
//     .then(function (response) {
//       return response.data
//     })
//     .catch(function (error) {
//       throw new Error(error);
//     });
// };