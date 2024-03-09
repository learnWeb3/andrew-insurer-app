import Container from "@mui/material/Container";
import { DevicesConcern } from "../../concerns/devices/index";
import { OidcSecure } from "@axa-fr/react-oidc";
import { OidcRoleGuard } from "../../components/OidcRoleGuard";
import { SetAuthenticatedUser } from "../../concerns/authenticated-user/SetAuthenticatedUser";
import { AvailableRoles } from "../../lib/available-roles.enum";
import { useRouter } from "next/router";
import { DeviceStatus } from "../../lib/device-status.enum";

export default function Devices() {
  const router = useRouter();
  return (
    <OidcSecure>
      <OidcRoleGuard
        hasAccessRoles={[AvailableRoles.INSURER, AvailableRoles.SUPERADMIN]}
      >
        <SetAuthenticatedUser>
          <Container>
            <DevicesConcern
              initialSearchFiltersStatus={
                (router?.query?.status as DeviceStatus) || DeviceStatus.PAIRED
              }
            />
          </Container>
        </SetAuthenticatedUser>
      </OidcRoleGuard>
    </OidcSecure>
  );
}
