import { TabPanel } from '@chakra-ui/react';
import { ReactNode } from 'react';

type AccessControlTabPanelProps = {
  body: ReactNode;
};

const AccessControlTabPanel = ({ body }: AccessControlTabPanelProps) => {
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

export default AccessControlTabPanel;
