import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { Link as MUILink, Typography } from "@mui/material";

export function RenderCellLink({
  hasFocus,
  value,
}: GridRenderCellParams<any, { label: string; href: string }>) {
  return value?.href ? (
    <Link href={value?.href || ""}>
      <MUILink variant="subtitle2">{value?.label}</MUILink>
    </Link>
  ) : (
    <Typography variant="subtitle2">{value?.label}</Typography>
  );
}
