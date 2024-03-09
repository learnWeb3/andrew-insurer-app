import { Grid, Paper, Typography } from "@mui/material";
import dynamic from "next/dynamic";

export const LineChart = dynamic(
  () => import("../../components/ApexChart").then((module) => module.LineChart),
  {
    ssr: false,
  }
);

export function DeviceStatistics() {
  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" gutterBottom>
          Statistics
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Device online presence / month
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <LineChart />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
