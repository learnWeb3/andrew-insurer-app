import { Button, Divider, Grid, Typography } from "@mui/material";
import { PaginatedResults } from "../../lib/paginated-results.interface";
import { Vehicle } from "../../lib/vehicle.interface";
import { VehicleInformations } from "../../components/VehicleInformations";
import RemoveIcon from "@mui/icons-material/Remove";

export interface VehiclesDetailProps {
  vehicles: PaginatedResults<Vehicle>;
  readOnly?: boolean;
}

export function VehiclesDetail({
  vehicles = {
    count: 0,
    results: [],
    limit: 10,
    start: 0,
  },
  readOnly = false,
}: VehiclesDetailProps) {
  return (
    <Grid container item xs={12} spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Vehicles ({vehicles?.results?.length})
        </Typography>
      </Grid>

      {vehicles?.results.length ? (
        vehicles.results.map((vehicle, index) => (
          <Grid container gap={2} item xs={12} key={index}>
            <VehicleInformations
              vehicle={vehicle}
              setVehicle={(vehicle) => {
                const updatedVehicles = [...vehicles.results];
                updatedVehicles.splice(index, 1, vehicle as Vehicle);
                // setData({
                //   ...data,
                //   vehicles.results: updatedVehicles,
                // });
              }}
              readOnly={readOnly}
              label={`Vehicle n°${index + 1}`}
              handleRegistrationCardFilePathChange={async (
                filePath: string
              ) => {
                // const vehicles.results = [...vehicles];
                // vehicles.splice(index, 1, {
                //   ...vehicles[index],
                //   vehicleRegistrationCardDocURL: filePath,
                // });
                // await save({
                //   ...data,
                //   vehicles,
                // });
                // setData({
                //   ...data,
                //   vehicles,
                // });
              }}
              handleDriverLicenseFilePathChange={async (filePath: string) => {
                // const vehicles = [...vehicles];
                // vehicles.splice(index, 1, {
                //   ...vehicles[index],
                //   driverLicenceDocURL: filePath,
                // });
                // await save({
                //   ...data,
                //   vehicles,
                // });
                // setData({
                //   ...data,
                //   vehicles,
                // });
              }}
              handleVehicleErrors={(vehicleErrors: {
                vin: string[];
                brand: string[];
                model: string[];
                originalInServiceDate: string[];
                registrationNumber: string[];
              }) => {
                // const _vehicleErrors = Object.values(vehicleErrors).reduce(
                //   (list, _errors: string[]) => {
                //     list.push(
                //       ..._errors.map(
                //         (_error) => `Vehicle ${index + 1}: ${_error}`
                //       )
                //     );
                //     return list;
                //   },
                //   []
                // );
                // setErrors(() => ({
                //   ...errors,
                //   [`vehicle-${index}`]: _vehicleErrors,
                // }));
              }}
            />
            {!readOnly ? (
              <Grid
                item
                xs={12}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                gap={2}
              >
                <Button
                  // onClick={() => handleRemoveVehicle(index)}
                  variant="contained"
                  color="error"
                  startIcon={<RemoveIcon />}
                >
                  Remove vehicle
                </Button>
              </Grid>
            ) : (
              false
            )}
            <Grid item xs={12}>
              <Divider variant="fullWidth" />
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography>No vehicles registered.</Typography>
      )}
    </Grid>
  );
}
