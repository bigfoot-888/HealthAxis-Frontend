import { Box, Skeleton, Stack } from '@mui/material';
import DrawerHeader from '../layout/drawer/DrawerHeader';

export default function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <Box>
      <DrawerHeader/>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${15 + i * 5}%`} height={32} />
        ))}
      </Stack>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <Stack key={r} direction="row" spacing={2} sx={{ mb: 1.5 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              variant="rectangular"
              width={`${15 + c * 5}%`}
              height={28}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>
      ))}
    </Box>
  );
}
