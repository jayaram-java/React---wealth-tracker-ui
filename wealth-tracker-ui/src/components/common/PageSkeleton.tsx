import React from 'react';
import { Box, Card, CardContent, Container, Skeleton } from '@mui/material';

/**
 * Clean page-level skeleton placeholder matching the application's general card/grid structure.
 * Displayed while lazy-loaded route components are fetched.
 */
export const PageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ width: '50%' }}>
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rounded" width={110} height={40} />
          <Skeleton variant="rounded" width={130} height={40} />
        </Box>
      </Box>

      {/* Metric Cards Skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={`page-stat-skeleton-${idx}`} sx={{ borderRadius: 3, p: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="70%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Main Content / Table Skeleton */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="text" width="25%" height={32} />
            <Skeleton variant="rounded" width={120} height={36} />
          </Box>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton
              key={`page-row-skeleton-${idx}`}
              variant="rounded"
              height={44}
              sx={{ my: 1.5, width: '100%' }}
            />
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PageSkeleton;
