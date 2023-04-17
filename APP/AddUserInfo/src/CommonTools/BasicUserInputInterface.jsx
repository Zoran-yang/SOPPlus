import {FreeSoloCreateOption} from '../Component/FreeSoloCreateOption.jsx';
// import ComboBox from "../Component/Autocomplete.jsx";
import Tags from '../Component/TaskTags.jsx';
import Button from '@mui/material/Button';
import TaskContentField from '../Component/TaskContentField.jsx';
import {EditorState, convertFromRaw} from 'draft-js'
import {useEffect, useState} from 'react';
import getTaskNames from './getTaskNames.jsx';
import saveTasksData from './saveTasksData.jsx';



export default function BasicUserInputInterface({
    title, 
    dataSource, 
    AfterSubmit = ()=>window.close(), 
    defaultValues = null, 
    AfterCancel = ()=>window.close(), 
    NextPage = null,
}){
    const sopId = defaultValues?.sopId || null;
    const [taskTypes, setTaskTypes] = useState(null);
    const [taskNames, setTaskNames] = useState(null);
    const [taskTags, setTaskTags] = useState(null);
    const [selectedTaskTypes, setSelectedTaskTypes] = useState(defaultValues&&JSON.parse(defaultValues["tasktype"])||null);
    const [selectedTaskNames, setSelectedTaskNames] = useState(defaultValues&&JSON.parse(defaultValues["taskname"])||null);
    // const [selectedTaskPhase, setSelectedTaskPhase] = useState(null);  considering to add concept of phase(timeline)
    const [selectedTaskTags, setSelectedTaskTags] = useState(defaultValues&&defaultValues["tasktag"]!=="null"&&JSON.parse(defaultValues["tasktag"]).map((item) => item.title)||undefined);
    const [addedTaskContent, setAddedTaskContent] = useState(
        defaultValues?.sop 
        ? () => EditorState.createWithContent(convertFromRaw(JSON.parse(defaultValues["sop"]))) 
        : () => EditorState.createEmpty()
    );
    const [isMistake, setIsMistake] = useState(false);
    const [IsSubmitted, setIsSubmitted] = useState(false)




    function handleTaskTypes(newValue) {
        if(newValue === null) return
        newValue = newValue.map((item) => {
            return JSON.parse(item.tasktype)
        })
        setTaskTypes(newValue);
    }
    
    function handleTaskTags(newValue) {
        if(!newValue.length) return // if there is no task tags, return
        newValue = newValue.map((item) => {
            return JSON.parse(item.tasktag)
        })
        setTaskTags(newValue);
    }
    
    function handleTaskNames(newValue) {
        if(newValue === null) return
        newValue = newValue.map((item) => {
            return JSON.parse(item.taskname)
        })
        setTaskNames(newValue);
    }    

    function handleSelectedTaskTypes(event, newValue) {
        if (typeof newValue === 'string') {
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
        if (!newValue?.title) return
        getTaskNames(newValue, handleTaskNames) //When TaskTypes change, taskNames change
    }

    function handleSelectedTaskName(event, newValue) {
        if (typeof newValue === 'string') {
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
        // console.log(JSON.stringify(convertToRaw(addedTaskContent.getCurrentContent())))
        setAddedTaskContent(newEditorState);
    }
    
    function handleSelectedTaskTags(event, newValue) {
        setSelectedTaskTags(newValue);
    }

    function handleIsSubmitted(){
        setIsSubmitted(true)
    }

    useEffect(() => {
        fetch("http://localhost:3000/getTaskInfos", // get task types from server
        {
          method: 'POST', 
          headers : {'Content-Type':'application/json'},
          body : JSON.stringify(
            {
              "id" : "zoran",
              "requestInfo" : {
                "requestType" : "taskTypes",
              }
            }
          )
        })
        .then(async(res) => {
          if (res.ok) {
            return handleTaskTypes(await res.json())
          } else {
            throw new Error('Request failed.');
          }})
        .catch(console.log) 
        
    
        fetch("http://localhost:3000/getTaskInfos",  // get task tags from server
        {
          method: 'POST', 
          headers : {'Content-Type':'application/json'},
          body : JSON.stringify(
            {
              "id" : "zoran",
              "requestInfo" : {
                "requestType" : "taskTags",
              }
            }
          )
        })
        .then(async(res) => {
          if (res.ok) {
            return handleTaskTags(await res.json())
          } else {
            throw new Error('Request failed.');
          }})
        .catch(console.log)     
    },[])
    
    if (IsSubmitted && NextPage) {
        return(
            <NextPage  // if the user has submitted the form, go to the next page
            selectedTaskTypes = {selectedTaskTypes} 
            selectedTaskNames = {selectedTaskNames}
            selectedTaskTags = {selectedTaskTags}
            />
        )        
    } else {
        return (
            <div style={{ width: "100%"}}>
                <h1 style={{textAlign: "center"}}>Add My {title}</h1>
                <div style={{display:"flex", flexWrap:"wrap", boxSizing:"border-box",}}>     
                    <FreeSoloCreateOption 
                        labelName="Task Type" 
                        taskInfo={taskTypes||JSON.parse(JSON.stringify([{"title": ""}]))}
                        selectedstatus={selectedTaskTypes} 
                        handleSelectedstatus={handleSelectedTaskTypes}/>
                    <FreeSoloCreateOption 
                        labelName="Task Name" 
                        taskInfo={taskNames || [{ title: ""}]} 
                        selectedstatus={selectedTaskNames} 
                        handleSelectedstatus={handleSelectedTaskName}/>
                    {/* <ComboBox taskInfo={taskPhase}/> considering to add concept of phase(timeline) */}  
                    <Tags 
                        taskInfo={taskTags||JSON.parse(JSON.stringify([{"title": ""}]))} 
                        handleSelectedTaskTags={handleSelectedTaskTags} 
                        selectedTaskTags={selectedTaskTags}
                    />               
                    <TaskContentField handleStatus={handleAddedTaskContent} editorState={addedTaskContent} title={title}/>
                </div>
                <div style={{
                display:"flex",
                justifyContent:"flex-end",
                flexWrap: "wrap",
                marginRight: 5
                }}>
                    <Button 
                    id='submit-btn' 
                    variant="outlined" 
                    sx={{ marginRight: 1}} 
                    onClick={()=>{
                        saveTasksData(dataSource, selectedTaskTypes, selectedTaskNames, selectedTaskTags, addedTaskContent, sopId, setIsMistake)
                        AfterSubmit()
                        handleIsSubmitted()
                    }}
                    >
                        Save
                    </Button>
                    <Button id='cancel-btn' variant="outlined" onClick={AfterCancel}>cancal</Button>
                </div>
            </div> 
        )
    }
}