import { useEffect, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Button,
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./body.module.css";

interface RowData {
  task: string;
  date: string;
  deadline: string;
  state: string;
  name: string;
  user: string;
  useracess: string;
  id: number;
  clientId: number;
  userid: number;
}

interface ThProps {
  children?: React.ReactNode; // The content of the column header (usually a string)
  reversed: boolean; // Indicates if the column is sorted in descending order
  sorted: boolean; // Indicates if the column is currently sorted
  onSort: () => void; // Function that handles the sorting logic when clicked
}
type User = {
  name: string;
  id: number;
  user: string;
  useracess: string;
};
interface TableType {
  tasks: RowData[];
  completedTasks: {
    deadline: string;
    date: string;
    clientId: number;
    task: string;
    state: string;
  }[];

  handlePutConcluid: (taskId: number) => void;

  sessionSelected: string;
  users: User[];
  admin: boolean;
}
interface UsersType {
  name: string;
  id: number;
  user: string;
  useracess: string;
}
interface CompletedTasks {
  deadline: string;
  date: string;
  clientId: number;
  task: string;
  state: string;
}

export function TableSort({
  tasks,
  handlePutConcluid,
  completedTasks,
  sessionSelected,
  users,
  admin,
}: TableType) {
  const [sortedTasks, setSortedTasks] = useState<RowData[]>([]);
  const [sortedCompletedTasks, setSortedCompletedTasks] = useState<
    CompletedTasks[]
  >([]);
  const [sortedUsers, setSortedUsers] = useState<UsersType[]>([]);
  useEffect(() => {
    setSortedCompletedTasks(completedTasks);
    if (sessionSelected === "Users") {
      if (Array.isArray(users)) {
        setSortedUsers(users); // Garantir que users seja um array
      }

      console.log(sessionSelected, sortedTasks);
    }
    setSortedTasks(tasks);

    console.log(admin, "boolw");
  }, [sessionSelected, tasks, completedTasks, users]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };
  const getRows = () => {
    if (!Array.isArray(sortedTasks)) {
      return null;
    }
    if (sessionSelected === "Tasks") {
      return sortedTasks.map((row, index) => (
        <Table.Tr key={index}>
          {admin === true ? (
            <>
              <Table.Td>{row.task}</Table.Td>
              <Table.Td>{row.date}</Table.Td>
              <Table.Td>{row.deadline}</Table.Td>
              <Table.Td>{row.state}</Table.Td>
              <Table.Td>{row.clientId}</Table.Td>
            </>
          ) : (
            <>
              <Table.Td>{row.task}</Table.Td>
              <Table.Td>{row.date}</Table.Td>
              <Table.Td>{row.deadline}</Table.Td>
              <Table.Td>{row.state}</Table.Td>
            </>
          )}
          {row.state === "pendente" && (
            <Table.Td>
              <Button
                onClick={() => handlePutConcluid(row.id)}
                variant="light"
                size="xs"
                radius="lg"
              >
                Concluído
              </Button>
            </Table.Td>
          )}
        </Table.Tr>
      ));
    }
    if (sessionSelected === "Users" && admin === true) {
      return sortedUsers.map((row, index) => (
        <Table.Tr key={index}>
          <>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.user}</Table.Td>
            <Table.Td>{row.useracess}</Table.Td>
            <Table.Td>{row.id}</Table.Td>
          </>
        </Table.Tr>
      ));
    }
    if (sessionSelected === "Completed Tasks") {
      return sortedCompletedTasks.map((row, index) => (
        <Table.Tr key={index}>
          {admin === true ? (
            <>
              <Table.Td>{row.task}</Table.Td>
              <Table.Td>{row.date}</Table.Td>
              <Table.Td>{row.deadline}</Table.Td>
              <Table.Td>{row.state}</Table.Td>
              <Table.Td>{row.clientId}</Table.Td>
            </>
          ) : (
            <>
              <Table.Td>{row.task}</Table.Td>
              <Table.Td>{row.date}</Table.Td>
              <Table.Td>{row.deadline}</Table.Td>
              <Table.Td>{row.state}</Table.Td>
            </>
          )}
        </Table.Tr>
      ));
    }
  };
  const rows = getRows();

  return (
    <ScrollArea className="mx-4">
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            {sessionSelected !== "Users" && admin === true && (
              <>
                <Th
                  sorted={sortBy === "task"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("task")}
                >
                  Task
                </Th>
                <Th
                  sorted={sortBy === "date"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("date")}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === "deadline"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deadline")}
                >
                  Deadline
                </Th>
                <Th
                  sorted={sortBy === "state"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("state")}
                >
                  State
                </Th>
                <Th
                  sorted={sortBy === "userid"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("userid")}
                >
                  userId
                </Th>
              </>
            )}
            {sessionSelected !== "Users" && admin === false && (
              <>
                <Th
                  sorted={sortBy === "task"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("task")}
                >
                  Task
                </Th>
                <Th
                  sorted={sortBy === "date"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("date")}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === "deadline"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("deadline")}
                >
                  Deadline
                </Th>
                <Th
                  sorted={sortBy === "state"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("state")}
                >
                  State
                </Th>
              </>
            )}

            {sessionSelected === "Users" && (
              <>
                <Th
                  sorted={sortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Name
                </Th>
                <Th
                  sorted={sortBy === "user"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("user")}
                >
                  User
                </Th>
                <Th
                  sorted={sortBy === "useracess"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("useracess")}
                >
                  Access
                </Th>
                <Th
                  sorted={sortBy === "id"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("id")}
                >
                  Id
                </Th>
              </>
            )}
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows && rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td
                colSpan={tasks && tasks[0] ? Object.keys(tasks[0]).length : 0}
              >
                <Text fw={500} ta="center">
                  Apply the Filter What you want
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
