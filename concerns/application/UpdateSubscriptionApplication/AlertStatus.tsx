import { CheckCircleOutline } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { ApplicationStatus } from "../../../lib/application-status.enum";

export interface AlertStatusProps {
  status: ApplicationStatus | null;
  statusHistory?: {
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
    comment: string;
  }[];
}

export function AlertStatus({ status, statusHistory = [] }: AlertStatusProps) {
  return (
    <>
      {status === ApplicationStatus.PENDING ? (
        <Alert icon={<CheckCircleOutline fontSize="inherit" />} severity="info">
          Customer has not yet validated it's subscription application
        </Alert>
      ): false}
      {status === ApplicationStatus.REVIEWING ? (
        <Alert icon={<CheckCircleOutline fontSize="inherit" />} severity="info">
          Customer has validated his subscription application please verify the
          informations, you can then accept, reject or ask to ammend the
          application.
        </Alert>
      ): false}
      {status === ApplicationStatus.PAYMENT_PENDING ? (
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="success"
        >
          We are awaiting the payment confirmation on the customer side.
          Customer must click on the payment link and proceed top checkout.
        </Alert>
      ): false}
      {status === ApplicationStatus.PAYMENT_CONFIRMED ? (
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="success"
        >
          Customer payment has been confirmed.
        </Alert>
      ): false}
      {status === ApplicationStatus.TO_AMMEND ? (
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="warning"
        >
          You have asked the customer to ammend his subscription application,
          please wait until he ask for a new application review <br />
          <strong>
            Reason:{" "}
            {statusHistory?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )?.[0]?.comment || ""}
          </strong>
        </Alert>
      ): false}
      {status === ApplicationStatus.REJECTED ? (
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="error"
        >
          We have rejected this application <br />
          <strong>
            Reason:{" "}
            {statusHistory?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )?.[0]?.comment || ""}
          </strong>
        </Alert>
      ): false}
    </>
  );
}
