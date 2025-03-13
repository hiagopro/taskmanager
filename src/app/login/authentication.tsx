"use client";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AuthenticationTitle() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState();
  const router = useRouter();
  function signin() {
    console.log(user, password);
    axios
      .post("http://localhost:500/login", {
        user,
        password,
      })
      .then((response) => {
        if (response.status == 201) {
          const token = response.data.token;
          const userId = response.data.userId;

          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", userId);
          router.replace("/home");
        } else {
          console.log(response.data);
        }
      });
  }
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
