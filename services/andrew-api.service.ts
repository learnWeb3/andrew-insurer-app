import axios, { AxiosResponse } from "axios";
import { ContractStatus } from "../lib/contract-status.enum";
import { FileType } from "../lib/file-type.enum";
import { ApplicationStatus } from "../lib/application-status.enum";
import { PaginatedResults } from "../lib/paginated-results.interface";
import { Notification } from "../lib/notification.interface";
import { DeviceStatus } from "../lib/device-status.enum";

const andrewApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export function getAuthorizationHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function createSubscriptionApplication(
  accessToken: string,
  data?: {
    vehicles?: {
      vin: string;
      brand: string;
      model: string;
      year: number;
      registrationNumber: string;
      originalInServiceDate: string;
      contractSubscriptionKm: number;
      driverLicenceDocURL: string;
      vehicleRegistrationCardDocURL: string;
    }[];
    contract?: {
      contractDocURL?: string;
      ecommerceProduct?: string;
      ecommerceGateway?: string;
    };
    contactInformations?: {
      phoneNumber: string;
      email: string;
    };
    billingInformations?: {
      lastName: string;
      firstName: string;
      company: string;
      address: string;
      postCode: string;
      city: string;
      country: string;
    };
    identityDocs?: {
      idCardDocURL: string;
      residencyProofDocURL: string;
    };
    paymentDocs?: {
      termsOfSaleDocURL: string;
    };
  }
) {
  const endpoint = `subscription-application`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  const newSubscriptionApplication = await andrewApi
    .post<
      any,
      AxiosResponse<{
        customer: string;
        status: ApplicationStatus;
        ref: string;
        _id: string;
        vehicles?: {
          vin: string;
          brand: string;
          model: string;
          year: number;
          registrationNumber: string;
          originalInServiceDate: string;
          contractSubscriptionKm: number;
          driverLicenceDocURL: string;
          vehicleRegistrationCardDocURL: string;
        }[];
        createdAt: string;
        updatedAt: string;
        __v: 0;
      }>
    >(endpoint, data, {
      headers,
    })
    .then(({ data }) => data);

  return await findSubscriptionApplication(
    newSubscriptionApplication._id,
    accessToken
  );
}

export async function createUser(accessToken: string) {
  const endpoint = `/customer`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  return andrewApi
    .post<any, AxiosResponse<{ _id: string }>>(endpoint, undefined, {
      headers,
    })
    .then(({ data }) => data);
}

export async function createThirdPartyUser(
  accessToken: string,
  data = {
    email: "",
    firstName: "",
    lastName: "",
    insurer: false,
  }
) {
  const endpoint = `/customer/account`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  return andrewApi
    .post<any, AxiosResponse<{ _id: string; password: string }>>(
      endpoint,
      data,
      {
        headers,
      }
    )
    .then(({ data }) => data);
}

export async function updateSubscriptionApplication(
  id: string,
  data: {
    vehicles: {
      vin: string;
      brand: string;
      model: string;
      year: number;
      registrationNumber: string;
      originalInServiceDate: string;
      contractSubscriptionKm: number;
      driverLicenceDocURL: string;
      vehicleRegistrationCardDocURL: string;
    }[];
    contract: {
      contractDocURL?: string;
      ecommerceProduct?: string;
      ecommerceGateway?: string;
    };
    contactInformations: {
      phoneNumber: string;
      email: string;
    };
    billingInformations: {
      lastName: string;
      firstName: string;
      company: string;
      address: string;
      postCode: string;
      city: string;
      country: string;
    };
    identityDocs: {
      idCardDocURL: string;
      residencyProofDocURL: string;
    };
    paymentDocs: {
      termsOfSaleDocURL: string;
    };
  },
  accessToken: string
) {
  const endpoint = `/subscription-application/${id}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  return andrewApi
    .patch(endpoint, data, {
      headers,
    })
    .then((response) => response.data);
}

export async function acceptApplication(
  id: string,
  comment: string,
  accessToken: string
) {
  const endpoint = `/subscription-application/${id}/finalize`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  const data = {
    status: ApplicationStatus.PAYMENT_PENDING,
    comment,
  };
  return andrewApi
    .patch(endpoint, data, {
      headers,
    })
    .then((response) => response.data);
}

export async function rejectApplication(
  id: string,
  comment: string,
  accessToken: string
) {
  const endpoint = `/subscription-application/${id}/finalize`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  const data = {
    status: ApplicationStatus.REJECTED,
    comment,
  };
  return andrewApi
    .patch(endpoint, data, {
      headers,
    })
    .then((response) => response.data);
}

export async function ammendApplication(
  id: string,
  comment: string,
  accessToken: string
) {
  const endpoint = `/subscription-application/${id}/finalize`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  const data = {
    status: ApplicationStatus.TO_AMMEND,
    comment,
  };
  return andrewApi
    .patch(endpoint, data, {
      headers,
    })
    .then((response) => response.data);
}

export async function listSubscriptionApplications(
  accessToken: string,
  status: ApplicationStatus,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/subscription-application`;
  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    status,
    ...searchFilters,
  });
  const queryString = queryParams.toString();
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function reviewSubscriptionApplication(
  subscriptionApplicationId: string,
  accessToken: string
) {
  const endpoint = `subscription-application/${subscriptionApplicationId}/review`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .patch(
      endpoint,
      {},
      {
        headers,
      }
    )
    .then((response) => response.data);
}

export async function findSubscriptionApplication(
  id: string,
  accessToken: string
) {
  const endpoint = `/subscription-application/${id}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  return andrewApi
    .get<
      any,
      AxiosResponse<{
        customer: {
          _id: string;
          insurer: boolean;
          authorizationServerUserId: string;
          contactInformations?: {
            email?: string;
            phoneNumber?: string;
          };
          paymentInformations: {
            ecommerceCustomer: string;
          };
          identityDocs?: {
            idCardDocURL?: string;
            residencyProofDocURL?: string;
          };
          paymentDocs?: {
            termsOfSaleDocURL?: string;
          };
          billingInformations?: {
            lastName?: string;
            firstName?: string;
            company?: string;
            address?: string;
            postCode?: string;
            city?: string;
            country?: string;
          };
          firstName: string;
          lastName: string;
          fullName: string;
          createdAt: string;
          updatedAt: string;
          __v: 0;
        };
        contract?: {
          contractDocURL?: string;
          ecommerceGateway?: string;
          ecommerceProduct?: string;
        };
        status: ApplicationStatus;
        ref: string;
        _id: string;
        vehicles?: {
          vin: string;
          brand: string;
          model: string;
          year: number;
          registrationNumber: string;
          originalInServiceDate: string;
          contractSubscriptionKm: number;
          driverLicenceDocURL: string;
          vehicleRegistrationCardDocURL: string;
        }[];
        createdAt: string;
        updatedAt: string;
        statusHistory?: {
          status: ApplicationStatus;
          createdAt: string;
          updatedAt: string;
          comment: string;
        }[];
        __v: 0;
      }>
    >(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findContract(id: string, accessToken: string) {
  const endpoint = `/contract/${id}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findContractDevices(id: string, accessToken: string) {
  const endpoint = `/contract/${id}/device`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findContractVehicles(id: string, accessToken: string) {
  const endpoint = `/contract/${id}/vehicle`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findDevice(id: string, accessToken: string) {
  const endpoint = `/device/${id}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findUser(id: string, accessToken: string) {
  const endpoint = `/customer/${id}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint, {
      headers,
    })
    .then((response) => response.data);
}

export async function findUserContracts(
  id: string,
  accessToken: string,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/customer/${id}/contract`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    ...searchFilters,
  });
  const queryString = queryParams.toString();

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function findUserDevices(
  id: string,
  accessToken: string,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/customer/${id}/device`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    ...searchFilters,
  });
  const queryString = queryParams.toString();

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function findUserSubscriptionApplications(
  id: string,
  accessToken: string,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/customer/${id}/subscription-application`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
    ...searchFilters,
  };

  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
  });
  const queryString = queryParams.toString();

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function listContracts(
  accessToken: string,
  status: ContractStatus = ContractStatus.ACTIVE,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/contract`;
  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    status: status,
    ...searchFilters,
  });
  const queryString = queryParams.toString();
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function listDevices(
  accessToken: string,
  status: DeviceStatus = DeviceStatus.PAIRED,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/device`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    status,
    ...searchFilters,
  });
  const queryString = queryParams.toString();

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function createDevice(
  accessToken: string,
  data = {
    serialNumber: "",
  }
) {
  const endpoint = `/device`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .post<
      any,
      AxiosResponse<{
        device: {
          _id: string;
          status: string;
          serialNumber: string;
          createdAt: string;
          updatedAt: string;
        };
        credentials: {
          type: string;
          value: string;
        };
      }>
    >(endpoint, data, {
      headers,
    })
    .then((response) => response.data);
}

export async function generateUploadPresignedURL(
  accessToken: string,
  data: {
    fileKey: FileType;
    fileName: string;
    mimetype: string;
  }
) {
  const endpoint = `/object-storage/upload`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  const { data: data_1 } = await andrewApi.post<
    any,
    AxiosResponse<{
      url: string;
      expires: number;
      fileName: string;
      fileKey: FileType;
    }>
  >(endpoint, data, {
    headers,
  });
  return data_1;
}

export async function generateDownloadPresignedURL(
  accessToken: string,
  data: {
    fileKey: FileType;
    fileName: string;
  }
) {
  const endpoint = `/object-storage/download`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };
  return andrewApi
    .post<
      any,
      AxiosResponse<{
        url: string;
        expires: number;
      }>
    >(endpoint, data, {
      headers,
    })
    .then(({ data }) => data);
}

export async function downloadFileFromPresignedURL(url: string) {
  return axios
    .get<any, AxiosResponse<Blob>>(url, {
      responseType: "blob",
      timeout: undefined,
    })
    .then(({ data }) => data);
}

export async function getPendingSubscriptionCount(accessToken: string) {
  return await Promise.all([
    listSubscriptionApplications(accessToken, ApplicationStatus.PENDING).then(
      ({ count }) => {
        return count;
      }
    ),
    listSubscriptionApplications(
      accessToken,
      ApplicationStatus.PAYMENT_PENDING
    ).then(({ count }) => {
      return count;
    }),
    listSubscriptionApplications(accessToken, ApplicationStatus.TO_AMMEND).then(
      ({ count }) => {
        return count;
      }
    ),
  ]).then(
    ([
      pendingSubscriptionApplicationsCount,
      paymentPendingSubscriptionApplicationsCount,
      toAmmendSubscriptionApplicationsCount,
    ]) => {
      return (
        pendingSubscriptionApplicationsCount +
        paymentPendingSubscriptionApplicationsCount +
        toAmmendSubscriptionApplicationsCount
      );
    }
  );
}

export async function uploadFileToObjectStorage(url: string, file: File) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = () => {
    const data = reader.result;

    return axios
      .put(url, data, {
        headers: {
          "Content-Type": file.type,
        },
      })
      .then((response) => response.data);
  };
}

export async function listUsers(
  accessToken: string,
  pagination: { start: number; limit: number } = { start: 0, limit: 10 },
  searchFilters: { value: string } | {} = {}
) {
  const endpoint = `/customer`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  const queryParams = new URLSearchParams({
    start: pagination.start.toString(),
    limit: pagination.limit.toString(),
    ...searchFilters,
  });
  const queryString = queryParams.toString();

  return andrewApi
    .get(endpoint + "?" + queryString, {
      headers,
    })
    .then((response) => response.data);
}

export async function listUserNotifications(
  id: string,
  accessToken: string,
  searchFilters: Record<string, any> = { start: 0, limit: 10 }
) {
  const endpoint = `/customer/${id}/notifications`;

  const queryParams = new URLSearchParams(searchFilters);
  const queryString = queryParams.toString();
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return andrewApi
    .get<any, AxiosResponse<PaginatedResults<Notification<any>>>>(
      endpoint + "?" + queryString,
      {
        headers,
      }
    )
    .then((response) => response.data);
}

export async function linkDeviceToVehicle(
  accessToken: string,
  deviceId: string,
  data?: {
    vehicle: string;
    customer: string;
    contract: string;
  }
) {
  const endpoint = `/device/${deviceId}`;
  const headers = {
    ...getAuthorizationHeaders(accessToken),
  };

  return await andrewApi
    .patch<any, AxiosResponse<any>>(endpoint, data, {
      headers,
    })
    .then(({ data }) => data);
}
