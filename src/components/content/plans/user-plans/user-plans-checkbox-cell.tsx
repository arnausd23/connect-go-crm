import { Checkbox, Flex } from '@chakra-ui/react';

const UserPlanCheckboxCell = ({ checked }: { checked: boolean }) => {
  return (
    <Flex w={'100%'} justifyContent={'center'}>
      <Checkbox defaultChecked={checked} readOnly={true} />
    </Flex>
  );
};

export default UserPlanCheckboxCell;
