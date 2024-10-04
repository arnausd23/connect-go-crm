import { TabPanel } from '@chakra-ui/react';
import { ReactNode } from 'react';

type CustomTabPanelProps = {
  body: ReactNode;
};

const CustomTabPanel = ({ body }: CustomTabPanelProps) => {
  return (
    <TabPanel
      bgColor={'dark'}
      borderRightRadius={'lg'}
      borderBottomLeftRadius={'lg'}
      h={'100%'}
      p={'1.5rem'}
      w={'100%'}
    >
      {body}
    </TabPanel>
  );
};

export default CustomTabPanel;
