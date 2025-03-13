"use client";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { TableSort } from "./body";
import { Header } from "./header";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [completedTasks, setCompletedTaks] = useState([]);
  const [sessionSelected, setSessionSelected] = useState("Tasks");
  const [loged, setLoged] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const fetch = async () => {
      const response = await axios.get(`http://localhost:500/tasks/${userId}`, {
        headers: {
          token: token,
          userId: userId,
        },
      });
      const data = (await response.data) as any;
      const tasks = data.filter((task) => task.state === "pendente");
      const tasksConcluid = data.filter((task) => task.state === "concluido");
      setTasks(tasks);
      setCompletedTaks(tasksConcluid);
    };
    const getAcess = async () => {
      const response = await axios.get("http://localhost:500/adminacess", {
        headers: {
          token: token,
          userId: userId,
        },
      });
      const data = response.data;

      console.log(data, "thisa caess", admin);
      if (data === true) {
        setAdmin(true);
        axios
          .get("http://localhost:500/users", {
            headers: {
              token: token,
              userId: userId,
            },
          })
          .then((res) => setUsers(res.data));
        console.log(admin);
      } else {
        setAdmin(false); // Caso contrário, define como false
      }
      setLoading(false); // Define loading como false após verificar o acesso
    };
    getAcess();
    axios
      .get("http://localhost:500/logedin", {})
      .then((response) => setLoged(response.data));
    axios
      .get("http://localhost:500/getnameuser", {
        headers: {
          token: token,
          userId: userId,
        },
      })
      .then((res) => setName(res.data));
    console.log(name);
    console.log(loged);

    console.log(admin, "acess is this");
    fetch();
  }, []);
  const handlePutConcluid = async (taskId) => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    console.log(userId, "oi");
    await axios.patch(
      "http://localhost:500/tasks",
      {
        taskId,
      },
      {
        headers: {
          token: token,
          userid: userId,
        },
      }
    );
    location.reload();
  };

  console.log(sessionSelected);
  console.log(tasks);

  useEffect(() => {
    if (admin !== undefined) {
      setLoading(false);
    }
    console.log(admin, "new");
  }, [admin]);

  return loged && !loading ? (
    <div className="">
      <Header
        name={name}
        setSessionSelected={setSessionSelected}
        admin={admin}
      />
      <TableSort
        tasks={tasks}
        handlePutConcluid={handlePutConcluid}
        sessionSelected={sessionSelected}
        completedTasks={completedTasks}
        users={users}
        admin={admin}
      />
    </div>
  ) : (
    <div>wait</div>
  );
}
