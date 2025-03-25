import {
  Button,
  Group,
  Input,
  Paper,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";

import classes from "./Popup.module.css";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function GetInTouch({ Popup, setPopup }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function AddUserOrTask() {
    const token = sessionStorage.getItem("token");
    const userSessionId = sessionStorage.getItem("userId");

    if (Popup === "Adduser") {
      await axios
        .post(
          "http://localhost:500/adduser",
          {
            username: userName,
            useremail: userEmail,
            userrole: userRole,
            password: password,
          },
          {
            headers: {
              token: token,
              userid: userSessionId,
            },
          }
        )
        .then((res) => {
          if (res.status != 201) {
            alert("You cant do This");
            router.replace("/login");
          }
        });
      setPopup(false);
    } else if (Popup === "Addtask") {
      await axios
        .post(
          "http://localhost:500/addtask",
          {
            task: userName,
            deadline: userEmail,

            clientId: userId,
          },
          {
            headers: {
              token: token,
              userid: userSessionId,
            },
          }
        )
        .then((res) => {
          if (res.status != 201) {
            alert("You cant do This");
            router.replace("/login");
          }
        });
      setPopup(false);
    }
  }

  return (
    <div className={classes.wrapper}>
      <Paper shadow="none" radius="lg">
        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <Text fz="lg" fw={700} className={classes.title}>
            {Popup === "Adduser" ? "User Data" : "Task"}
          </Text>

          <div className={classes.field}>
            <div className={classes.field}>
              <label htmlFor="username" className={classes.inputLabel}>
                {Popup === "Adduser" ? "User name" : "Task"}
              </label>
              <TextInput
                id="username"
                className={classes.inputField}
                placeholder={Popup === "Adduser" ? "User name" : "Task"}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className={classes.field}>
              <label htmlFor="email" className={classes.inputLabel}>
                {Popup === "Adduser" ? "User Email" : "Deadline"}
              </label>
              <TextInput
                id="email"
                className={classes.inputField}
                placeholder={
                  Popup === "Adduser" ? "youremail@gmail.com" : "Deadline"
                }
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div className={classes.field}>
              <label htmlFor="role" className={classes.inputLabel}>
                {Popup === "Adduser" ? "User Role" : "User id"}
              </label>

              {Popup === "Adduser" ? (
                <>
                  <Input
                    id="role"
                    component="select"
                    rightSection={<IconChevronDown size={14} stroke={1.5} />}
                    pointer
                    mt="md"
                    className={classes.inputField}
                    onChange={(e) => setUserRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Input>
                  <label htmlFor="role" className={classes.inputLabel}>
                    Password
                  </label>
                  <TextInput
                    id="email"
                    className={classes.inputField}
                    placeholder="Ex: HGAH927"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </>
              ) : (
                <>
                  <Input
                    id="email"
                    className={classes.inputField}
                    placeholder="id"
                    required
                    onChange={(e) => setUserId(e.target.value)}
                  ></Input>
                </>
              )}
            </div>

            <Group justify="flex-end" mt="md">
              <Button
                type="submit"
                className={classes.control}
                onClick={AddUserOrTask}
              >
                Additional
              </Button>
            </Group>
          </div>
        </form>
      </Paper>
    </div>
  );
}
