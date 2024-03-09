import { Button, Grid } from "@mui/material";
import { UpdateSubscriptionApplicationData } from ".";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ApplicationStatus } from "../../../lib/application-status.enum";
import { useEffect, useState } from "react";
import { useMissingDocumentsErrors } from "./MissingDocumentErrors/useMissingDocumentsErrors";
import DoneIcon from "@mui/icons-material/Done";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import EditIcon from "@mui/icons-material/Edit";

export interface ChangesValidationStepProps {
  data: UpdateSubscriptionApplicationData;
  errors: { [field: string]: string[] };
  setErrors: (
    errors:
      | { [field: string]: string[] }
      | ((errors: { [field: string]: string[] }) => {
          [field: string]: string[];
        })
  ) => void;
  setData: (newData: any) => void;
  accept: (data: UpdateSubscriptionApplicationData) => Promise<void>;
  save: (data: UpdateSubscriptionApplicationData) => Promise<void>;
  review: (data: UpdateSubscriptionApplicationData) => Promise<void>;
  reject: (data: UpdateSubscriptionApplicationData) => Promise<void>;
  ammend: (data: UpdateSubscriptionApplicationData) => Promise<void>;
  readOnly?: boolean;
}
export function ChangesValidationStep({
  data,
  setData = (newData: UpdateSubscriptionApplicationData) => {},
  save = async (data: UpdateSubscriptionApplicationData) => {},
  accept = async (data: UpdateSubscriptionApplicationData) => {},
  review = async (data: UpdateSubscriptionApplicationData) => {},
  reject = async (data: UpdateSubscriptionApplicationData) => {},
  ammend = async (data: UpdateSubscriptionApplicationData) => {},
  errors = {},
  setErrors = (errors = {}) => {},
  readOnly = false,
}: ChangesValidationStepProps) {
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  useEffect(() => {
    Object.values(errors).reduce((errors, globalList) => {
      globalList.push(...errors);
      return globalList;
    }, []);
  }, [errors]);
  const {
    missingIdentityDocumentsErrors,
    missingContractsDocumentsErrors,
    missingVehiclesDocumentsErrors,
  } = useMissingDocumentsErrors(data);
  return readOnly ? (
    <Grid
      container
      item
      xs={12}
      spacing={2}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        gap={2}
      >
        {data?.status === ApplicationStatus.PENDING ? (
          <Button
            startIcon={<VisibilityIcon />}
            onClick={async () => {
              await save(data);
              await review(data);
            }}
            variant="contained"
            disabled={
              globalErrors?.length ||
              missingContractsDocumentsErrors?.length ||
              missingIdentityDocumentsErrors?.length ||
              missingVehiclesDocumentsErrors?.length ||
              !data?.vehicles?.length ||
              !data?.contract?.ecommerceProduct
                ? true
                : false
            }
          >
            Ask for review
          </Button>
        ): false}

        {data?.status === ApplicationStatus.REVIEWING ? (
          <Button
            startIcon={<DoneIcon />}
            onClick={() => accept(data)}
            variant="contained"
            disabled={
              globalErrors?.length ||
              missingContractsDocumentsErrors?.length ||
              missingIdentityDocumentsErrors?.length ||
              missingVehiclesDocumentsErrors?.length ||
              !data?.vehicles?.length ||
              !data?.contract?.ecommerceProduct
                ? true
                : false
            }
          >
            Accept application
          </Button>
        ): false}

        {data?.status === ApplicationStatus.REVIEWING ? (
          <Button
            startIcon={<DoNotDisturbIcon />}
            onClick={() => reject(data)}
            variant="contained"
            color="error"
            disabled={false}
          >
            Reject application
          </Button>
        ): false}

        {data?.status === ApplicationStatus.REVIEWING ? (
          <Button
            startIcon={<EditIcon />}
            onClick={() => ammend(data)}
            variant="contained"
            color="warning"
            disabled={false}
          >
            Ask to ammend application
          </Button>
        ): false}
      </Grid>
    </Grid>
  ) : null;
}
