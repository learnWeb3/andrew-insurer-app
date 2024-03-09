import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserStatus } from "../../lib/user-status.enum";
import { ContractStatus } from "../../lib/contract-status.enum";
import { DeviceStatus } from "../../lib/device-status.enum";
import { ApplicationStatus } from "../../lib/application-status.enum";
import { Badge, Box } from "@mui/material";

export function RenderCellUserSatus({
  hasFocus,
  value,
}: GridRenderCellParams<any, UserStatus>) {
  return (
    <Box>
      {value === UserStatus.ACTIVE ? (
        <Badge badgeContent={"Active"} color="success" />
      ) : value === UserStatus.INACTIVE ? (
        <Badge badgeContent={"Inactive"} color="info" />
      ) : value === UserStatus.DISABLED ? (
        <Badge badgeContent={"Disabled"} color="error" />
      ): false}
    </Box>
  );
}

export function RenderCellContractSatus({
  hasFocus,
  value,
}: GridRenderCellParams<any, ContractStatus>) {
  return value === ContractStatus.ACTIVE ? (
    <Badge badgeContent={"Active"} color="success" />
  ) : value === ContractStatus.INACTIVE ? (
    <Badge badgeContent={"Inactive"} color="info" />
  ) : value === ContractStatus.PAYMENT_PENDING ? (
    <Badge badgeContent={"Payment pending"} color="warning" />
  ) : value === ContractStatus.PAYMENT_RENEWAL_ERROR ? (
    <Badge badgeContent={"Payment renewal error"} color="error" />
  ) : value === ContractStatus.CANCELED ? (
    <Badge badgeContent={"Canceled"} color="error" />
  ) : null;
}

export function RenderCellApplicationSatus({
  hasFocus,
  value,
}: GridRenderCellParams<any, ApplicationStatus>) {
  return value === ApplicationStatus.PENDING ? (
    <Badge badgeContent={"Pending"} color="info" />
  ) : value === ApplicationStatus.REVIEWING ? (
    <Badge badgeContent={"Reviewing"} color={"info"} />
  ) : value === ApplicationStatus.PAYMENT_PENDING ? (
    <Badge badgeContent={"Payment pending"} color="info" />
  ) : value === ApplicationStatus.PAYMENT_CONFIRMED ? (
    <Badge badgeContent={"Payment confirmed"} color="success" />
  ) : value === ApplicationStatus.PAYMENT_CANCELED ? (
    <Badge badgeContent={"Payment canceled"} color="error" />
  ) : value === ApplicationStatus.TO_AMMEND ? (
    <Badge badgeContent={"To ammend"} color="warning" />
  ) : value === ApplicationStatus.REJECTED ? (
    <Badge badgeContent={"Rejected"} color="error" />
  ) : null;
}

export function RenderCellDeviceSatus({
  hasFocus,
  value,
}: GridRenderCellParams<any, DeviceStatus>) {
  return value === DeviceStatus.PAIRED ? (
    <Badge badgeContent={"Active"} color="success" />
  ) : value === DeviceStatus.INACTIVE ? (
    <Badge badgeContent={"Inactive"} color="info" />
  ) : value === DeviceStatus.DISABLED ? (
    <Badge badgeContent={"Disabled"} color="error" />
  ) : null;
}
