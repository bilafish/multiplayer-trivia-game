import { Box } from "@chakra-ui/react";

const optionColours = ["#5582ac", "#f8f1ba", "#ea977d", "#e2c14d"];

// Parse HTML entities in string
export const parseEntities = (content) =>
  new DOMParser().parseFromString(content, "text/html").body.innerText;

const Option = ({ index, content, isSelected, onClickHandler }) => {
  return (
    <Box
      p="1rem"
      w="8rem"
      h="10rem"
      borderRadius="lg"
      borderWidth={isSelected ? "0.4rem" : "0px"}
      borderColor="white"
      cursor="pointer"
      color="#151515"
      bg={optionColours[index]}
      onClick={onClickHandler}
    >
      {parseEntities(content)}
    </Box>
  );
};

export default Option;
