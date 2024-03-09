import { Grid, Typography, Link as MUILink } from "@mui/material";
import Link from "next/link";
import { Customer } from "../../lib/customer.interface";

export interface UserDetailProps {
  user: Customer | null;
}

export function UserDetail({ user = null }: UserDetailProps) {
  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          User
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MUILink variant="h6">
          <Link href={`/users/${user?._id}`}>{user?.fullName}</Link>
        </MUILink>
      </Grid>
    </Grid>
  );
}
