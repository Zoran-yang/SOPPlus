import Button from "@mui/material/Button";
// for instant testing
// import ErrorWarning from "../CommonTools/Component/ErrorWarning.jsx";
// import saveTasksData from "../CommonTools/Function/saveTasksData.jsx";
import { ErrorWarning, saveTasksData } from "reactcommontool-zy";

export default function ButtonGruopOfAddUserInfo({
  dataSource,
  AfterCancel,
  selectedTaskTypes,
  selectedTaskNames,
  selectedTaskTags,
  addedTaskContent,
  sopId,
  setIsMistake,
  isMistake,
  setButtonClicked,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        marginRight: 5,
      }}
    >
      <div style={{ textAlign: "right", padding: 5 }}>
        {isMistake && <ErrorWarning error={isMistake} />}
      </div>
      <Button
        id="submit-btn"
        variant="outlined"
        color="primary"
        sx={{ marginRight: 1 }}
        onClick={async () => {
          await saveTasksData(
            dataSource,
            selectedTaskTypes,
            selectedTaskNames,
            selectedTaskTags,
            addedTaskContent,
            sopId,
            setIsMistake
          );
          setButtonClicked("AddUserInfo-save");
        }}
      >
        Save
      </Button>
      <Button id="cancel-btn" variant="outlined" onClick={AfterCancel}>
        cancal
      </Button>
    </div>
  );
}
