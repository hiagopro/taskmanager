"use client";
import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AuthenticationTitle() {
  const [user, setUser] = useState("");
  const [loged, setLoged] = useState(false);
  const [password, setPassword] = useState<string>();
  const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL_API;
  const router = useRouter();

  function signin() {
    console.log(HOST_URL);
    axios
      .post(`${HOST_URL}login`, {
        user,
        password,
      })
      .then((response) => {
        if (response.status == 201) {
          const token = response.data.token;
          const userId = response.data.userId;
          setLoged(true);
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", userId);
          router.replace("/home");
        }
        console.log();
      })
      .catch((res) => {
        alert(res.response.data);
      });
  }
  useEffect(() => {
    if (loged === true) {
      router.replace("/home");
    }
  }, []);
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@gmail.com"
          required
          onChange={(e) => setUser(e.target.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Group justify="space-between" mt="lg"></Group>
        <Button fullWidth mt="xl" onClick={signin}>
          Signin
        </Button>
      </Paper>
    </Container>
  );
}
