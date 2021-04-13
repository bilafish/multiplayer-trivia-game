import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { sortWith, descend, ascend, prop } from "ramda";
// Sorting Helper
const scoreNameSort = sortWith([descend(prop("score")), ascend(prop("name"))]);
const LeaderboardTable = ({ data }) => {
  const sortedData = scoreNameSort(data);
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Rank</Th>
          <Th>Player</Th>
          <Th isNumeric>Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedData.map((player, index) => (
          <Tr>
            <Td>{index + 1}</Td>
            <Td>{player.name}</Td>
            <Td isNumeric>{player.score}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
export default LeaderboardTable;
