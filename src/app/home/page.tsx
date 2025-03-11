'use client'
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { TableSort} from './body'
import { Header } from "./header";

export default function HomePage() {
 const [tasks,setTasks]= useState([])
 
 const [completedTasks, setCompletedTaks]= useState([])
 const [sessionSelected, setSessionSelected] =useState('Tasks')
 const [loged, setLoged] = useState(false)
useEffect(() => {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");
  
  const fetch = async () => {
    const response = await axios.get(`http://localhost:500/tasks/${userId}`,{
      headers:{
        token:token
      }
    });
    const data = await response.data as any ;
    const tasks = data.filter((task)=>task.state === 'pendente');
    const tasksConcluid = data.filter((task)=>task.state === 'concluido');
    setTasks(tasks);
    setCompletedTaks(tasksConcluid)
  }
   axios.get('http://localhost:500/logedin', { }).then((response)=> setLoged(response.data)  )
    
   console.log(loged)
  
  fetch();
}, []);
  const handlePutConcluid =async(taskId)=>{
  await axios.patch('http://localhost:500/tasks', {
    taskId
  })
  location.reload()
 }
  
 console.log(sessionSelected)
  console.log(tasks)
  return (
   loged ? (
    <div className="">
      
      <Header setSessionSelected={setSessionSelected}/>
      <TableSort tasks={tasks} handlePutConcluid={handlePutConcluid} sessionSelected={sessionSelected} completedTasks={completedTasks}/>
      
    </div>
   ):(<div></div>)
   
    
  );
}
