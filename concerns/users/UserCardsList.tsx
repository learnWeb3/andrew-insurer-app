import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Button, CardHeader, Paper } from "@mui/material";
import { parseDateString } from "../../services/date-formatter.service";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

export interface UserCardProps {
  id: string;
  fullName: {
    label: string;
    href: string;
  };
  currentDiscountRate: number;
  createdAt: string;
  contractsCount: {
    label: number;
    href: string;
  };
}

export function UserCard({
  id,
  fullName,
  currentDiscountRate,
  createdAt,
  contractsCount,
}: UserCardProps) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        title={
          <Typography variant="subtitle2" gutterBottom>
            {parseDateString(createdAt)}
          </Typography>
        }
      />
      <CardContent>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          {fullName?.label}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={fullName?.href || ""}>
          <Button component={"button"}>See details</Button>
        </Link>
        <Link href={contractsCount?.href || ""}>
          <Button component={"button"}>
            See {contractsCount.label} contract
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export interface UsersCardsListProps {
  rows: UserCardProps[];
}

export function UsersCardsList({ rows = [] }: UsersCardsListProps) {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      {rows.map((row) => (
        <UserCard
          key={row.id}
          id={row.id}
          fullName={row.fullName}
          currentDiscountRate={row.currentDiscountRate}
          contractsCount={row.contractsCount}
          createdAt={row.createdAt}
        />
      ))}
      {!rows?.length ? (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            minHeight: "50vh",
          }}
        >
          <CreateOutlinedIcon sx={{ fontSize: "3rem" }} />
          <Typography>No data just yet...</Typography>
        </Paper>
      ) : (
        false
      )}
    </Box>
  );
}
