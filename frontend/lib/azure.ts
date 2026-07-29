import axios from "axios";

export async function analyzeReceipt(base64: string) {
  const endpoint = process.env.AZURE_ENDPOINT!.replace(/\/$/, "");
  const key = process.env.AZURE_API_KEY!;

  const url = `${endpoint}/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31`;

  // convert base64 → buffer
  const buffer = Buffer.from(base64, "base64");

  const start = await axios.post(url, buffer, {
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream", // 🔥 IMPORTANT
    },
  });

  const operationLocation = start.headers["operation-location"];

  // poll result
  let result;
  while (true) {
    const res = await axios.get(operationLocation, {
      headers: {
        "Ocp-Apim-Subscription-Key": key,
      },
    });

    if (res.data.status === "succeeded") {
      result = res.data;
      break;
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  return result;
}

// export async function analyzeReceipt(base64: string) {
//   console.log("🔥 NEW FILE LOADED");

//   console.log("AZURE =", process.env.AZURE_ENDPOINT);

//   return {};
// }