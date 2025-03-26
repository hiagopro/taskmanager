"use client";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { TableSort } from "./body";
import { Header } from "./header";
import { useRouter } from "next/navigation";
import { Loader } from "@mantine/core";
interface Task {
  id: number;
  task: string;
  date: string;
  deadline: string;
  state: "pendente" | "concluido"; // Como você está filtrando por essas duas opções
  clientId: number;
  userId: number;
  user?: string; // Caso "user" seja opcional
  name?: string; // Caso "name" seja opcional
  useracess?: string; // Caso "useracess" seja opcional
}
export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [completedTasks, setCompletedTaks] = useState([]);
  const [sessionSelected, setSessionSelected] = useState("Tasks");
  const [loged, setLoged] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL_API;
  const router = useRouter();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const fetch = async () => {
      const response = await axios.get(`${HOST_URL}tasks/${userId}`, {
        headers: {
          token: token,
          userId: userId,
        },
      });

      const data = await response.data;
      const tasks = data.filter((task: Task) => task.state === "pendente");
      const tasksConcluid = data.filter(
        (task: Task) => task.state === "concluido"
      );
      setTasks(tasks);
      setCompletedTaks(tasksConcluid);
    };
    const getAcess = async () => {
      const response = await axios.get(`${HOST_URL}adminacess`, {
        headers: {
          token: token,
          userId: userId,
        },
      });
      const data = response.data;
      const status = response.status;
      if (data === true) {
        setAdmin(true);
        axios
          .get(`${HOST_URL}users`, {
            headers: {
              token: token,
              userId: userId,
            },
          })
          .then((res) => setUsers(res.data))
          .catch((res) => {
            alert(res.response.data);
            router.replace("/login");
          });
        console.log(admin);
      } else {
        setAdmin(false);
        if (status != 201) {
          router.replace("/login");
        } // Caso contrário, define como false
      }
      setLoading(false); // Define loading como false após verificar o acesso
    };
    getAcess();
    axios.get(`${HOST_URL}logedin`, {}).then((response) => {
      setLoged(response.data);
      if (response.status != 201) {
        router.replace("/home");
        alert("Please, do the login again");
      }
    });
    axios
      .get(`${HOST_URL}getnameuser`, {
        headers: {
          token: token,
          userId: userId,
        },
      })
      .then((res) => {
        setName(res.data);
      })
      .catch((res) => {
        alert(res.response.data);
        router.replace("/login");
      });

    fetch();
  }, []);
  const handlePutConcluid = async (taskId: number) => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    console.log(userId, "oi");
    await axios
      .patch(
        `${HOST_URL}tasks`,
        {
          taskId,
        },
        {
          headers: {
            token: token,
            userid: userId,
          },
        }
      )
      .then((res) => {
        setName(res.data);
      })
      .catch((res) => {
        alert(res.response.data);
        router.replace("/login");
      });
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
    <div className="flex items-center justify-center h-screen">
      <Loader className="m-auto" color="blue" />
    </div>
  );
}
