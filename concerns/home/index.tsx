import { Grid, Typography } from "@mui/material";
import { RevenueChart } from "./RevenueChart";
import { BusinessMetrics } from "./BusinessMetrics";

export function HomeConcern() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <BusinessMetrics />
      </Grid>
      <Grid item xs={12}>
        <RevenueChart />
      </Grid>
    </Grid>
  );
}
