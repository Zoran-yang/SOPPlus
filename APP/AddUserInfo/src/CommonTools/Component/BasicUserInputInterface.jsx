import { FreeSoloCreateOption } from "../../Component/FreeSoloCreateOption.jsx";
// import ComboBox from "../Component/Autocomplete.jsx";
import Tags from "../../Component/TaskTags.jsx";
import TaskContentField from "../../Component/TaskContentField.jsx";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { useEffect, useState } from "react";
import getTaskNames from "../Function/getTaskNames.jsx";
import strategyDecorator from "../Function/linkFormatOfTexteditor.jsx";

export default function BasicUserInputInterface({
  title,
  dataSource,
  AfterSubmit = () => console.log("submit"), // not close window,
  defaultValues = null,
  AfterCancel = () => window.close(),
  // AfterCancel = () => console.log("cancel"), // for debug
  NextPage = null,
  children,
}) {
  const sopId = (defaultValues && defaultValues.sopid) || null;
  const [taskTypes, setTaskTypes] = useState(null);
  const [taskNames, setTaskNames] = useState(null);
  const [taskTags, setTaskTags] = useState(null);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState(() => {
    const defaultType = defaultValues && JSON.parse(defaultValues["tasktype"]);
    if (defaultValues && defaultType) {
      getTaskNames(defaultType, handleTaskNames); //When TaskTypes change, taskNames change
      return defaultType;
    } else {
      return null;
    }
  });
  const [selectedTaskNames, setSelectedTaskNames] = useState(
    (defaultValues && JSON.parse(defaultValues["taskname"])) || null
  );
  //const [selectedTaskPhase, setSelectedTaskPhase] = useState(null);  considering to add concept of phase(timeline)
  const [selectedTaskTags, setSelectedTaskTags] = useState(
    (defaultValues &&
      defaultValues["tasktag"] !== "null" &&
      JSON.parse(defaultValues["tasktag"]).map((item) => item.title)) ||
      [] // if there is no task tags, set it to null
  );
  const [addedTaskContent, setAddedTaskContent] = useState(
    defaultValues?.sop
      ? () =>
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(defaultValues["sop"])),
            strategyDecorator
          )
      : () => EditorState.createEmpty(strategyDecorator)
  );
  const [isMistake, setIsMistake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleTaskTypes(newValue) {
    if (newValue === null) return;
    newValue = newValue.map((item) => {
      return JSON.parse(item.tasktype);
    });
    setTaskTypes(newValue);
  }

  function handleTaskTags(newValue) {
    if (!newValue.length) return; // if there is no task tags, return
    newValue = newValue.map((item) => {
      return JSON.parse(item.tasktag);
    });
    setTaskTags(newValue);
  }

  function handleTaskNames(newValue) {
    if (newValue === null) return;
    newValue = newValue.map((item) => {
      return JSON.parse(item.taskname);
    });
    setTaskNames(newValue);
  }

  function handleSelectedTaskTypes(event, newValue) {
    if (typeof newValue === "string") {
      setSelectedTaskTypes({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setSelectedTaskTypes({
        title: newValue.inputValue,
      });
    } else {
      setSelectedTaskTypes(newValue);
    }
    if (!newValue?.title) return;
    getTaskNames(newValue, handleTaskNames); //When TaskTypes change, taskNames change
  }

  function handleSelectedTaskName(event, newValue) {
    if (typeof newValue === "string") {
      setSelectedTaskNames({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setSelectedTaskNames({
        title: newValue.inputValue,
      });
    } else {
      setSelectedTaskNames(newValue);
    }
  }

  function handleAddedTaskContent(newEditorState) {
    // console.log(
    //   "handleAddedTaskContent",
    //   JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
    // );
    setAddedTaskContent(newEditorState);
  }

  function handleSelectedTaskTags(event, newValue) {
    setSelectedTaskTags(newValue);
  }

  function handleIsSubmitted() {
    setIsSubmitted(true);
  }

  function clearUserInput() {
    setSelectedTaskTypes(null);
    setSelectedTaskNames(null);
    setSelectedTaskTags([]);
    setAddedTaskContent(() => EditorState.createEmpty(strategyDecorator));
  }

  useEffect(() => {
    fetch(
      "http://localhost:3000/getTaskInfos", // get task types from server
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "zoran",
          requestInfo: {
            requestType: "taskTypes",
          },
        }),
      }
    )
      .then(async (res) => {
        if (res.ok) {
          return handleTaskTypes(await res.json());
        } else {
          throw new Error("Request failed.");
        }
      })
      .catch(console.log);

    fetch(
      "http://localhost:3000/getTaskInfos", // get task tags from server
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "zoran",
          requestInfo: {
            requestType: "taskTags",
          },
        }),
      }
    )
      .then(async (res) => {
        if (res.ok) {
          return handleTaskTags(await res.json());
        } else {
          throw new Error("Request failed.");
        }
      })
      .catch(console.log);
  }, []);

  if (isSubmitted && NextPage) {
    // if the user has submitted the form, go to the next page
    return (
      <NextPage
        selectedTaskTypes={selectedTaskTypes}
        selectedTaskNames={selectedTaskNames}
        selectedTaskTags={selectedTaskTags}
      />
    );
  } else {
    // General Layout of the page
    return (
      <div style={{ width: "100%" }}>
        <h1 style={{ textAlign: "center" }}>Add My {title}</h1>
        <div
          style={{ display: "flex", flexWrap: "wrap", boxSizing: "border-box" }}
        >
          <FreeSoloCreateOption
            labelName="Task Type"
            taskInfo={taskTypes || JSON.parse(JSON.stringify([{ title: "" }]))}
            selectedstatus={selectedTaskTypes}
            handleSelectedstatus={handleSelectedTaskTypes}
          />
          <FreeSoloCreateOption
            labelName="Task Name"
            taskInfo={taskNames || [{ title: "" }]}
            selectedstatus={selectedTaskNames}
            handleSelectedstatus={handleSelectedTaskName}
          />
          {/* <ComboBox taskInfo={taskPhase}/> considering to add concept of phase(timeline) */}
          <Tags
            taskInfo={taskTags || JSON.parse(JSON.stringify([{ title: "" }]))}
            handleSelectedTaskTags={handleSelectedTaskTags}
            selectedTaskTags={selectedTaskTags}
          />
          <TaskContentField
            handleStatus={handleAddedTaskContent}
            editorState={addedTaskContent}
            title={title}
          />
        </div>
        {children(
          dataSource,
          AfterSubmit,
          AfterCancel,
          clearUserInput,
          handleIsSubmitted,
          selectedTaskTypes,
          selectedTaskNames,
          selectedTaskTags,
          addedTaskContent,
          sopId,
          setIsMistake,
          isMistake
        )}
      </div>
    );
  }
}
