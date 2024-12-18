import Flow from './components/Flow';
import { useState } from 'react';
import Toolbar from './components/Toolbar';

const CampaignProfile = ({ steps })  => {
  const [mode, setMode] = useState('profile');

  return (
    <div style={{ height: '100%', backgroundColor: '#efefef' }}>
      <Toolbar
        currentMode={mode}
        changeMode={setMode}
      />
      <Flow mode={mode} steps={steps} />
    </div>
  );
};

export default CampaignProfile;