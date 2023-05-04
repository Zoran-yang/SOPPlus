import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import CreateIcon from "@mui/icons-material/Create";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import saveTasksData from "../../../../AddUserInfo/src/CommonTools/Function/saveTasksData.jsx";
import delTaskData from "../../../../AddUserInfo/src/CommonTools/Function/delTaskData.jsx";

export default function DisplayTaskTagsList({ data }) {
  const [taskInfos, setTaskInfos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevising, setIsRevising] = useState(null);
  const [newTaskTag, setNewTaskTag] = useState(null);
  const [isMistake, setIsMistake] = useState(false);

  function formatTaskInfos(data) {
    if (data) {
      // formats the data
      let formattedData = data.map((item) => {
        let newItem = Object.assign({}, item);
        newItem["tasktag"] = JSON.parse(item["tasktag"]).title;
        return newItem;
      });

      // classifies the task names by task type

      setTaskInfos(formattedData);
      // console.log("DisplayTasNamesList", "useEffect", formattedData); // for debug
      setIsLoading(false);
    }
  }

  // re-render the updated TaskName data to DisplayTaskNamesList
  const handleUpdatedTaskType = (originalTaskNameInfos, newTaskName) => {
    // format updated data
    const updatedTaskName = {
      tasktag: newTaskTag,
      id: originalTaskNameInfos.id,
    };
    // upadte data to revised TaskName
    setTaskInfos((prevSopData) => {
      const updatedTasks = prevSopData.map((task) => {
        if (task.id === updatedTaskName.id) {
          return updatedTaskName;
        } else {
          return task;
        }
      });
      return updatedTasks;
    });
  };

  // re-render the delete info to DisplayTaskNamesList
  const handleDeletedTaskTypes = (id) => {
    // delete TaskName list
    setTaskInfos(
      (prevSopData) =>
        (prevSopData = prevSopData.filter((task) => task.id !== id))
    );
  };

  async function deleteConfirmation() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this permanently?"
    );
    if (confirmed) {
      // User clicked "OK" in the confirmation dialog
      await delTaskData("taskTags", item.id, setIsMistake);
      if (isMistake) return;
      handleDeletedTaskTypes(item.id);
    } else {
      // User clicked "Cancel" in the confirmation dialog
      // Do nothing, or optionally display a message
    }
  }

  useEffect(() => {
    formatTaskInfos(data);
  }, []);

  // isLoading is true when taskInfos is null
  if (isLoading) {
    return <div>Task Tags Loading...</div>;
  }

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {taskInfos.map((item) => (
        <div key={`item-${item.tasktag}`}>
          <ListItem
            key={`item-${item.tasktag}`}
            sx={
              isRevising === item.tasktag
                ? { display: "none" }
                : { display: "block" }
            }
            secondaryAction={
              <>
                <IconButton
                  aria-label="Revise"
                  onClick={() => setIsRevising(item.tasktag)}
                >
                  <CreateIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={() => {
                    deleteConfirmation();
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={item.tasktag} />
          </ListItem>
          <ListItem
            key={`item-${item.tasktag}-revising`}
            sx={
              isRevising === item.tasktag
                ? { display: "block" }
                : { display: "none" }
            }
            secondaryAction={
              <>
                <IconButton
                  aria-label="Done"
                  onClick={() => {
                    saveTasksData(
                      "ReviseTaskTag",
                      null, //updated task types
                      null, //if null, no change, saveTasksData will return the original task name
                      newTaskTag, // updated task tags
                      null, // updated task content
                      null, // sop id
                      setIsMistake, // set the mistake message
                      item.id
                    );
                    if (isMistake) return;
                    handleUpdatedTaskType(item, newTaskTag);
                    setNewTaskTag(null);
                    setIsRevising(null);
                  }}
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    setNewTaskTag(null);
                    setIsRevising(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </>
            }
          >
            <TextField
              required
              id="outlined-required"
              label="Required"
              defaultValue={item.tasktag}
              onChange={(event) => {
                setNewTaskTag(event.target.value);
              }}
            />
          </ListItem>
        </div>
      ))}
    </List>
  );
}
