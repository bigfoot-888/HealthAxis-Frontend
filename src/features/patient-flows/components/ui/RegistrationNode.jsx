import { useCallback } from "react";
import { Position, Handle } from '@xyflow/react';
import { Box } from "@mui/material";

export default function RegistrationNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <Box 
      sx={{
        border: '2px solid', // Increased to 2px to make the primary color pop a bit more
        borderColor: 'primary.main', 
        borderRadius: '8px', // A slightly larger radius looks great with M3
        padding: '1rem', 
        backgroundColor: 'primary.container', 
        color: 'primary.onContainer',
        // Optional: Add your custom shadow for some depth!
        boxShadow: (theme) => theme.palette.baseShadow 
      }}
    >
      <div>
        {/* We inherit the color: 'primary.onContainer' from the Box above */}
        <label htmlFor="text" style={{ fontWeight: 500, marginRight: '8px' }}>Text:</label>
        <input 
          id="text" 
          name="text" 
          onChange={onChange} 
          className="nodrag" 
          style={{
             // Just some quick inline styling to make the input match the M3 feel
             border: '1px solid #757780', // using your 'outline' color
             borderRadius: '4px',
             padding: '4px 8px'
          }}
        />
      </div>
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
    </Box>
  );
}