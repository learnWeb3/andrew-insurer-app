import { Grid, Typography } from "@mui/material";
import { BusinessMetrics } from "./BusinessMetrics";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

export function HomeConcern() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display={"flex"} alignItems={"center"} gap={1}>
        <BarChartOutlinedIcon color="inherit" />
        <Typography variant="h6" component="h2">
          Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <BusinessMetrics />
      </Grid>
    </Grid>
  );
}
