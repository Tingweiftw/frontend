import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { Container, Button, Form, FormCheck } from "@govtechsg/sgds-react";

import CONFIG from "../config";
import Table from "../components/Table";
import crossIcon from "../icons/cross.svg";

export type TodoItemProps = {
  id: string;
  description: string;
  done: boolean;
  refreshToDos: () => void;
};

function TodoItem(props: TodoItemProps) {
  return (
    <>
      <tr>
        <td>{/* insert checkbox here  */}</td>
        <td width={"100%"}>{props.description}</td>
        <td>
          <img alt="delete-icon" src={crossIcon} className="delete-icon" />
        </td>
      </tr>
    </>
  );
}

function Todo() {
  const [todoItems, setTodoItems] = useState<{ [id: string]: TodoItemProps }>(
    {}
  );
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const dateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  } as const;

  useEffect(() => {
    populateTodos();
  }, []);

  const populateTodos = useCallback(async () => {
    const result = await axios.get(`${CONFIG.API_ENDPOINT}/todos`);
    setTodoItems(result.data);
  }, []);

  async function submitNewTodo() {
    setIsLoading(true);
    const newTodo = {
      description: newTodoDescription,
    };
    await axios.post(`${CONFIG.API_ENDPOINT}/todos`, newTodo);
    await populateTodos();
    setNewTodoDescription("");
    setIsLoading(false);
  }

  return (
    <Container>
      <div className="has-background-gradient">
        <h2>Today</h2>
        {today.toLocaleDateString("en-UK", dateOptions)}
      </div>
      <Form>
        <Table isFullwidth isHoverable isHorizontal isBordered>
          <thead>
            <tr>
              <th>Done</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(todoItems).map((item) => (
              <TodoItem
                key={todoItems[item].id}
                {...todoItems[item]}
                refreshToDos={populateTodos}
              />
            ))}
            <tr>
              <td>
                <FormCheck disabled />
              </td>
              <td width={"100%"}>
                <input
                  className="text table-input"
                  placeholder="Enter new to-do here"
                  id="newTodoDescription"
                  type="text"
                  value={newTodoDescription}
                  onChange={(event) => {
                    setNewTodoDescription(event.currentTarget.value);
                  }}
                ></input>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>
      <Button
        size="sm"
        variant="primary"
        onClick={submitNewTodo}
        disabled={isLoading}
      >
        {isLoading ? "loading..." : "Add"}
      </Button>
    </Container>
  );
}

export default Todo;
