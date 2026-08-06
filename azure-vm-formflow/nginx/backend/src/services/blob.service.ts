import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";

const accountName =
  process.env.AZURE_STORAGE_ACCOUNT_NAME;

const accountKey =
  process.env.AZURE_STORAGE_ACCOUNT_KEY;

const containerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME ||
  "receipts";

/**
 * Azure Blob Storage is optional.
 *
 * The backend can run without Azure Storage.
 * When the required environment variables are
 * provided, Blob Storage functionality becomes available.
 */
const isBlobStorageConfigured =
  Boolean(accountName && accountKey);

let containerClient:
  ReturnType<
    BlobServiceClient["getContainerClient"]
  > | null = null;

let sharedKeyCredential:
  StorageSharedKeyCredential | null = null;

if (isBlobStorageConfigured) {
  sharedKeyCredential =
    new StorageSharedKeyCredential(
      accountName!,
      accountKey!
    );

  const blobServiceClient =
    new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

  containerClient =
    blobServiceClient.getContainerClient(
      containerName
    );

  console.log(
    "Azure Blob Storage configured successfully"
  );
} else {
  console.warn(
    "Azure Blob Storage is not configured. " +
      "Receipt storage is currently unavailable."
  );
}

/**
 * Upload file to Azure Blob Storage.
 *
 * This function will only work when Azure
 * Blob Storage has been configured.
 */
export const uploadToBlob = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!containerClient) {
    throw new Error(
      "Azure Blob Storage is not configured. " +
        "Please configure AZURE_STORAGE_ACCOUNT_NAME, " +
        "AZURE_STORAGE_ACCOUNT_KEY, and " +
        "AZURE_STORAGE_CONTAINER_NAME."
    );
  }

  const blobName =
    `${Date.now()}-${file.originalname}`;

  const blockBlobClient =
    containerClient.getBlockBlobClient(
      blobName
    );

  await blockBlobClient.uploadData(
    file.buffer,
    {
      blobHTTPHeaders: {
        blobContentType:
          file.mimetype,
      },
    }
  );

  return blobName;
};

/**
 * Generate a temporary SAS URL.
 *
 * Azure Blob Storage must be configured
 * before this function can be used.
 */
export const generateSasUrl = (
  blobName: string
): string => {
  if (
    !sharedKeyCredential ||
    !accountName
  ) {
    throw new Error(
      "Azure Blob Storage is not configured. " +
        "Cannot generate SAS URL."
    );
  }

  const startsOn =
    new Date(
      Date.now() -
        5 * 60 * 1000
    );

  const expiresOn =
    new Date(
      Date.now() +
        60 * 60 * 1000
    );

  const sasToken =
    generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions:
          BlobSASPermissions.parse(
            "r"
          ),
        startsOn,
        expiresOn,
        protocol:
          SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(
    blobName
  )}?${sasToken}`;
};