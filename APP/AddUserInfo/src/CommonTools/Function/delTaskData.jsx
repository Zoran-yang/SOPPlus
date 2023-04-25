import fetchToServer from "./fetchToServer.jsx";

export default function delTaskData(
  delKey,
  // Mistake Warning
  setIsMistake = (info) => {
    info ? console.log("delTaskData", info) : null;
  }
) {
  deleteSop(delKey, setIsMistake);
}

function deleteSop(sopId, setIsMistake) {
  let serverResponseHandle = async (res) => {
    setIsMistake(false);
    return await res.json();
  };
  let serverErrorHandle = async (res) => {
    res = await res.json();
    if ((res = "SOP is not deleted")) {
      setIsMistake("SOP is not deleted");
    }
    throw new Error("Request failed.");
  };
  fetchToServer(
    "deleteTaskInfos",
    {
      id: "zoran",
      deletedInfo: {
        requestType: "TaskSOP",
        sopId: sopId,
      },
    },
    serverResponseHandle,
    serverErrorHandle
  );
}
