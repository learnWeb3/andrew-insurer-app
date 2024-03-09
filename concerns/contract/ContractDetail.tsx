import { FormControl, Grid, Typography } from "@mui/material";
import { DateField } from "../../components/DateField";
import { Contract } from "../../lib/contract.interface";
import { validateRequired } from "../../components/TextField/validators";

export interface ContractDetailProps {
  contract: Contract | null;
  readOnly?: boolean;
}

export function ContractDetail({
  contract = null,
  readOnly = false,
}: ContractDetailProps) {
  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Contract
        </Typography>
      </Grid>

      {contract ? (
        <Grid container item xs={12} spacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <DateField
                label="Creation date"
                value={contract?.createdAt}
                validate={validateRequired}
                errors={[]}
                setErrors={() => {}}
                handleInput={() => {}}
              />
            </FormControl>
          </Grid>
        </Grid>
      ): false}
    </Grid>
  );
}
