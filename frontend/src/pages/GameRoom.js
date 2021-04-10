import { Heading, Center, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const ENDPOINT = "http://localhost:5000";

let socket;

const GameRoom = () => {
  const { id } = useParams();
  const { name } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { name: name, room: id }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [id]);

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  return (
    <Center bg="#151515" minH="100vh">
      <VStack spacing="1rem" color="white">
        <Heading color="#5582ac">Game Room</Heading>
        <p>Users in room:</p>
        {users.length > 0 &&
          users.map((user) => <p key={user.id}>{user.name}</p>)}
      </VStack>
    </Center>
  );
};
export default GameRoom;
