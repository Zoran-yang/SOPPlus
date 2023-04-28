import Button from "@mui/material/Button";
import ErrorWarning from "../../AddUserInfo/src/CommonTools/Component/ErrorWarning.jsx";
import saveTasksData from "../../AddUserInfo/src/CommonTools/Function/saveTasksData.jsx";

export default function ButtonGruopOfReviseUserInfo({
  dataSource,
  AfterSubmit, // not close window,
  AfterCancel,
  clearUserInput,
  handleIsSubmitted,
  selectedTaskTypes,
  selectedTaskNames,
  selectedTaskTags,
  addedTaskContent,
  sopId,
  setIsMistake,
  isMistake,
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
          console.log("BasicUserInputInterface", "isMistake", isMistake);

          if (isMistake) return; // if there is a mistake, don't go to the next page
          AfterSubmit(
            selectedTaskTypes, // for DisplaySopArea.jsx
            selectedTaskNames, // for DisplaySopArea.jsx
            selectedTaskTags, // for DisplaySopArea.jsx
            JSON.stringify(convertToRaw(addedTaskContent.getCurrentContent())), // for DisplaySopArea.jsx // If render addedTaskContent to DisplaySopArea will cause error in production mode.
            sopId // for DisplaySopArea.jsx
          );
          clearUserInput();
          handleIsSubmitted();
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
