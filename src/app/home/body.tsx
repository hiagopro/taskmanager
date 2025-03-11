import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import {
    Button,
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import classes from './body.module.css';
 
interface RowData {
  task: string;
  date: string;
  deadline: string;
  state:string;
}
interface TasksData {
   tasks: {
    task: string;
    date: string;
    deadline: string;
    state:string;
   }
   
  }

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
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

function filterData(tasks: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return tasks.filter((item) =>
    keys(item).some((key) => {
      const value = item[key];
      // Verifica se o valor é uma string antes de usar toLowerCase
      return typeof value === 'string' && value.toLowerCase().includes(query);
    })
);
  
}

function sortData(
  tasks: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(tasks, payload.search);
  }

  return filterData(
    [...tasks].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}



export function TableSort({tasks, handlePutConcluid, completedTasks, sessionSelected}) {
    const [sortedTasks, setSortedTasks] = useState<RowData[]>(tasks);
    useEffect(() => {
        if (sessionSelected === 'Completed Tasks') {
          setSortedTasks(completedTasks);
        } else {
          setSortedTasks(tasks);
        }
        console.log(sessionSelected)
      }, [sessionSelected, tasks, completedTasks]);
  const [search, setSearch] = useState('');
  
  
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedTasks(sortData(sortedTasks, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedTasks(sortData(sortedTasks, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = Array.isArray(sortedTasks) ? sortedTasks.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.task}</Table.Td>
      <Table.Td>{row.date}</Table.Td>
      <Table.Td>{row.deadline}</Table.Td>
      <Table.Td>{row.state}</Table.Td>
      <Table.Td>
     
      {row.state === 'pendente' && (
        <Button 
          onClick={() => handlePutConcluid(row.id)} 
          variant="light" 
          size="xs" 
          radius="lg"
        >
          Concluído
        </Button>
      )}

      </Table.Td>
     
    </Table.Tr>
  )) : null;
  
  ;

  return (
    <ScrollArea className='mx-4' >
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'task'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('task')}
            >
              Task
            </Th>
            <Th
              sorted={sortBy === 'date'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('date')}
            >
              Date
            </Th>
            <Th
              sorted={sortBy === 'deadline'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('deadline')}
            >
              Deadline
            </Th>
            <Th
              sorted={sortBy === 'state'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('state')}
            >
             State
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows?.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={tasks && tasks[0] ? Object.keys(tasks[0]).length : 0}>
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