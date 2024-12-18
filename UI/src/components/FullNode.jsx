import { Handle } from 'react-flow-renderer';
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from '@material-ui/core';
import ProgressIcon from './ProgressIcon';

const getIcon = (node) => {
  switch (node.type) {
    case 'secret-scan':
      return '🔒'; // Secret scanning icon
    case 'sca':
      return '📦'; // Software composition icon
    case 'sast':
      return '🔍'; // Static analysis icon
    case 'dast':
      return '🌐'; // Dynamic analysis icon
    case 'container':
      return '📦'; // Container icon
    case 'iac-scan':
      return '⚙️'; // Infrastructure icon
    case 'vulnerability':
      return '🛡️'; // Vulnerability icon
    default: 
      return '🔧'; // Default tool icon
  }
};

const FullNode = ({ data: nodeData }) => {
  const stepIcon = getIcon(nodeData);
  const notReachedValue = nodeData.data?.potentialTarget - nodeData.data?.target || 0;
  const formatDecimal = (value) => +parseFloat(value).toFixed(2);

  // Add console.log to debug the incoming data
  console.log('FullNode Data:', nodeData);

  return (
    <div className="node-container bg-white rounded-xl shadow-lg p-4" style={{ minWidth: '280px', minHeight: '390px' }}>
      <div className={`node-status node-status-${nodeData.phase?.toLowerCase()} px-4 py-2 text-white font-medium rounded-t-xl`}>
        {nodeData.phase}
      </div>

      {nodeData.previous?.length > 0 && (
        <Handle
          type="target"
          position="left"
          className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white"
        />
      )}

      <div className="mt-4 space-y-4">
        {/* Tool Info Section */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xl">{stepIcon}</span>
          </div>
          <div>
            <Typography variant="subtitle1" className="font-medium">
              {nodeData.name}
            </Typography>
            {nodeData.contentName && (
              <Typography variant="body2" className="text-gray-600" title={nodeData.contentName}>
                {nodeData.contentName.length > 45 ? nodeData.contentName.substring(0, 45) + '...' : nodeData.contentName}
              </Typography>
            )}
          </div>
        </div>

        {/* Date Section */}
        <Box className="bg-gray-50 rounded-lg p-3">
          <Typography variant="subtitle2" className="text-gray-600 mb-1">
            Date
          </Typography>
          {typeof(nodeData.date) === 'object' ? (
            <Typography variant="body2">
              From {nodeData.date.from} to {nodeData.date.to}
            </Typography>
          ) : (
            <Typography variant="body2">
              {nodeData.date}
            </Typography>
          )}
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2} className="bg-gray-50 rounded-lg p-2">
          <Grid item xs={4}>
            <Typography variant="caption" className="text-gray-600">
              Potential
            </Typography>
            <Typography variant="body2" className="font-medium">
              {nodeData.data?.potentialTarget || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" className="text-gray-600">
              Target
            </Typography>
            <Typography variant="body2" className="font-medium">
              {nodeData.data?.target || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" className="text-gray-600">
              {nodeData.data?.percentOK?.label || 'Progress'}
            </Typography>
            <Typography variant="body2" className="font-medium">
              {nodeData.data?.percentOK?.value || 0}%
            </Typography>
          </Grid>
        </Grid>

        {/* Analytics Table */}
        <TableContainer className="bg-gray-50 rounded-lg">
          <Table size="small">
            <TableBody>
              {nodeData.data?.analytics?.map(({ value, label, color }, index) => (
                <TableRow key={index}>
                  <TableCell style={{ width: '20px', padding: '8px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: color,
                      borderRadius: '50%'
                    }} />
                  </TableCell>
                  <TableCell>{label}</TableCell>
                  <TableCell align="right">{value}</TableCell>
                  <TableCell align="right">
                    {formatDecimal(value / (nodeData.data?.potentialTarget || 1) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell style={{ width: '20px', padding: '8px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#cccccc',
                    borderRadius: '50%'
                  }} />
                </TableCell>
                <TableCell>Not Reached</TableCell>
                <TableCell align="right">{notReachedValue}</TableCell>
                <TableCell align="right">
                  {formatDecimal(notReachedValue / (nodeData.data?.potentialTarget || 1) * 100)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {nodeData.final !== true && (
        <Handle
          type="source"
          position="right"
          className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white"
        />
      )}
    </div>
  );
};

export default FullNode;
