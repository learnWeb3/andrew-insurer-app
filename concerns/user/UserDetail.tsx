import { FormControl, Grid, Hidden, Typography } from "@mui/material";
import { TextField } from "../../components/TextField";
import { Customer } from "../../lib/customer.interface";
import {
  validateEmail,
  validateMobilePhone,
  validateRequired,
} from "../../components/TextField/validators";
import { ObjectStorageFileField } from "../../components/ObjectStorageFileField";
import { FileType } from "../../lib/file-type.enum";
import { MapsAutocompleteTextField } from "../../components/MapAutocompleteTextField";

export interface UserDetailProps {
  user: Customer;
  errors: { [field: string]: string[] };
  setErrors: (
    errors:
      | { [field: string]: string[] }
      | ((errors: { [field: string]: string[] }) => {
          [field: string]: string[];
        })
  ) => void;
  setUser: (user: Customer) => void;
  save: (user: Customer) => Promise<void>;
  readOnly?: boolean;
}

export function UserDetail({
  user,
  errors = {},
  setErrors = (errors = {}) => {},
  setUser = (user: Customer) => {},
  save = async (user: Customer) => {},
  readOnly = false,
}: UserDetailProps) {
  async function handleIdCardFilePathChange(filePath: string) {
    if (user) {
      const { _id, ...other } = user;
      const updatedData = {
        ...other,
        identityDocs: {
          ...user.identityDocs,
          idCardDocURL: filePath,
        },
      };
    }
    // await updateSubscriptionApplication(
    //   _id,
    //   removeEmptyKeys(updatedData),
    //   accessToken
    // ).then(() => setData({ _id, ref, status, ...updatedData }));
  }

  async function handleResidencyProofFilePathChange(filePath: string) {
    if (user) {
      const { _id, ...other } = user;
      const updatedData = {
        ...other,
        identityDocs: {
          ...user.identityDocs,
          residencyProofDocURL: filePath,
        },
      };
    }
    // await updateSubscriptionApplication(
    //   _id,
    //   removeEmptyKeys(updatedData),
    //   accessToken
    // ).then(() => {
    //   setData({ _id, ref, status, ...updatedData });
    // });
  }
  return (
    <Grid
      container
      item
      xs={12}
      spacing={4}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          User informations
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle2">
            Identity
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Lastname"
            id="lastName"
            validate={validateRequired}
            value={user?.lastName}
            errors={(errors.lastName as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                lastName: _errors,
              }))
            }
            handleInput={(value) => {
              setUser({
                ...user,
                lastName: value,
              });
            }}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Firstname"
            id="firstName"
            validate={validateRequired}
            value={user?.firstName}
            errors={(errors.firstName as any) || []}
            setErrors={(_errors) =>
              setErrors({
                ...errors,
                firstName: _errors,
              })
            }
            handleInput={(value) => {
              setUser({
                ...user,
                firstName: value,
              });
            }}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle2">
            Billing identity
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Lastname"
            id="lastName"
            validate={validateRequired}
            value={user?.billingInformations?.lastName}
            errors={(errors.lastName as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                lastName: _errors,
              }))
            }
            handleInput={(value) => {
              setUser({
                ...user,
                billingInformations: {
                  ...(user?.billingInformations
                    ? user.billingInformations
                    : {}),
                  lastName: value,
                },
              });
            }}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Firstname"
            id="firstName"
            validate={validateRequired}
            value={user?.billingInformations?.firstName}
            errors={(errors.firstName as any) || []}
            setErrors={(_errors) =>
              setErrors({
                ...errors,
                firstName: _errors,
              })
            }
            handleInput={(value) => {
              setUser({
                ...user,
                billingInformations: {
                  ...(user?.billingInformations
                    ? user?.billingInformations
                    : {}),
                  firstName: value,
                },
              });
            }}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle2">
          Contact
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          label="Email"
          id="email"
          validate={validateEmail}
          value={user?.contactInformations?.email}
          errors={(errors.email as any) || []}
          setErrors={(_errors) =>
            setErrors((errors) => ({
              ...errors,
              email: _errors,
            }))
          }
          handleInput={(value) => {
            setUser({
              ...user,
              contactInformations: {
                ...(user?.contactInformations ? user.contactInformations : {}),
                email: value,
              },
            });
          }}
          readOnly={readOnly}
        />
      </Grid>

      <Grid item xs={12} lg={6}>
        <TextField
          label="Mobile Phone"
          id="phoneNumber"
          validate={validateMobilePhone}
          value={user.contactInformations?.phoneNumber}
          errors={(errors.phoneNumber as any) || []}
          setErrors={(_errors) =>
            setErrors((errors) => ({
              ...errors,
              phoneNumber: _errors,
            }))
          }
          handleInput={(value) => {
            setUser({
              ...user,
              contactInformations: {
                ...(user?.contactInformations ? user.contactInformations : {}),
                phoneNumber: value,
              },
            });
          }}
          readOnly={readOnly}
        />
      </Grid>

      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle2">
            Documents
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <FormControl>
            <ObjectStorageFileField
              label="id card"
              fileType={FileType.ID_CARD}
              filePath={user?.identityDocs?.idCardDocURL || ""}
              onFilePathChange={handleIdCardFilePathChange}
              fileNameOverride={"id-card"}
              readOnly={readOnly}
            />
          </FormControl>
          <FormControl>
            <ObjectStorageFileField
              label="residency proof"
              fileType={FileType.RESIDENCY_PROOF}
              filePath={user?.identityDocs?.residencyProofDocURL || ""}
              onFilePathChange={handleResidencyProofFilePathChange}
              fileNameOverride={"residency-proof"}
              readOnly={readOnly}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle2">
            Residency
          </Typography>
        </Grid>
        {!readOnly ? (
          <Grid item xs={12}>
            <MapsAutocompleteTextField
              label="Start typing your address in here..."
              id="address"
              value={user?.billingInformations?.address}
              handleInput={(value) => {
                setUser({
                  ...user,
                  billingInformations: {
                    ...(user?.billingInformations
                      ? user.billingInformations
                      : {}),
                    address: value.address,
                    city: value.city,
                    postCode: value.postCode,
                    country: value.country,
                  },
                });
              }}
            />
          </Grid>
        ) : (
          false
        )}
        <Grid item xs={12}>
          <TextField
            label="Address"
            id="address"
            validate={validateRequired}
            value={user?.billingInformations?.address}
            errors={(errors.address as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                address: _errors,
              }))
            }
            readOnly={true}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            label="City"
            id="city"
            validate={validateRequired}
            value={user?.billingInformations?.city}
            errors={(errors.city as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                city: _errors,
              }))
            }
            readOnly={true}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            label="Postcode"
            id="postCode"
            validate={validateRequired}
            value={user?.billingInformations?.postCode}
            errors={(errors.postCode as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                postCode: _errors,
              }))
            }
            readOnly={true}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            label="Country"
            id="country"
            validate={validateRequired}
            value={user?.billingInformations?.country}
            errors={(errors.country as any) || []}
            setErrors={(_errors) =>
              setErrors((errors) => ({
                ...errors,
                country: _errors,
              }))
            }
            readOnly={true}
          />
        </Grid>
      </Grid>

      <Hidden lgDown>
        <Grid item lg={6}></Grid>
      </Hidden>
    </Grid>
  );
}
