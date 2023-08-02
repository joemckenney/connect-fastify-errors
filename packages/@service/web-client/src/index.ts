import { Service } from "@service/definition";
import { createConnectTransport } from "@bufbuild/connect-web";
import { createPromiseClient } from "@bufbuild/connect";

// See https://github.com/aspect-build/rules_ts/issues/159#issuecomment-1437399901
// > https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1270716220
import type {} from "@bufbuild/protobuf";
const PORT = 6060;
const baseUrl = `http://localhost:${PORT}`;

export const transport = createConnectTransport({
  baseUrl,
  credentials: "include",
});

export const client = createPromiseClient(Service, transport);
