import { supabase } from "../supabaseClient";

export type TitleRow = {
  id: string;
  title: string | null;
  description: string | null;
  image_data?: unknown;
  created_at?: string | null;
};

export type NewsEntry = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrl: string | null;
};

const TABLE_NAME = "titles";

/* ---------------------------------------------------------
   BYTEA FIX → Convert Uint8Array → Real PostgreSQL BYTEA HEX
   --------------------------------------------------------- */
const bytesToHex = (bytes: Uint8Array) =>
  "\\x" +
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

// =========================================================
// Existing Helpers (UNCHANGED)
// =========================================================

const detectMimeType = (source: string | Uint8Array) => {
  const normalized =
    typeof source === "string"
      ? source.startsWith("\\x")
        ? source.slice(2)
        : source
      : Array.from(source.slice(0, 4))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
  if (normalized.startsWith("ffd8ff")) return "image/jpeg";
  if (normalized.startsWith("89504e47")) return "image/png";
  if (normalized.startsWith("474946")) return "image/gif";
  return "image/png";
};

const encodeBytesToBase64 = (bytes: Uint8Array) => {
  if (!bytes.length) return "";
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    let chunkBinary = "";
    for (let i = 0; i < chunk.length; i += 1) {
      chunkBinary += String.fromCharCode(chunk[i]);
    }
    binary += chunkBinary;
  }
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(binary);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(binary, "binary").toString("base64");
  }
  return "";
};

const arrayLikeToBytes = (value: unknown): Uint8Array | null => {
  if (!value) return null;
  if (value instanceof Uint8Array) return value;
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer.slice(0));
  }
  if (Array.isArray(value)) {
    return Uint8Array.from(value as number[]);
  }
  if (typeof value === "object" && "data" in (value as Record<string, unknown>)) {
    const dataValue = (value as { data?: number[] }).data;
    if (Array.isArray(dataValue)) {
      return Uint8Array.from(dataValue);
    }
  }
  return null;
};

const bytesToDataUrl = (bytes: Uint8Array) => {
  const base64 = encodeBytesToBase64(bytes);
  if (!base64) return null;
  return `data:${detectMimeType(bytes)};base64,${base64}`;
};

const hexStringToDataUrl = (hexValue: string) => {
  const cleaned = hexValue.startsWith("\\x") ? hexValue.slice(2) : hexValue;
  if (!cleaned) return null;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
  }
  return bytesToDataUrl(bytes);
};

const isHexString = (value: string) => /^[0-9a-f]+$/i.test(value) && value.length % 2 === 0;

const byteaToDataUrl = (value?: unknown) => {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("data:")) return value;
    if (value.startsWith("\\x")) return hexStringToDataUrl(value);
    if (isHexString(value)) return hexStringToDataUrl(value);
    return `data:image/png;base64,${value}`;
  }

  const bytes = arrayLikeToBytes(value);
  if (bytes) return bytesToDataUrl(bytes);

  return null;
};

const mapRowToEntry = (row: TitleRow): NewsEntry => ({
  id: row.id,
  title: row.title?.trim() || "Untitled update",
  description:
    row.description?.trim() || "No description was provided for this announcement.",
  createdAt: row.created_at ?? new Date().toISOString(),
  imageUrl: byteaToDataUrl(row.image_data),
});

// =========================================================
// FETCH
// =========================================================

export const fetchTitleEntries = async (): Promise<NewsEntry[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as TitleRow[]).map(mapRowToEntry);
};

// =========================================================
// INSERT (FIXED BYTEA FORMAT)
// =========================================================

type InsertPayload = {
  title: string;
  description: string;
  imageData?: Uint8Array | null;
};

export const insertTitleEntry = async ({
  title,
  description,
  imageData,
}: InsertPayload): Promise<NewsEntry> => {

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      title,
      description,
      image_data: imageData ? bytesToHex(imageData) : null, // 👈 FIXED
    })
    .select()
    .single();

  if (error) throw error;

  return mapRowToEntry(data as TitleRow);
};

// =========================================================
// UPDATE (FIXED BYTEA FORMAT)
// =========================================================

type UpdatePayload = {
  title: string;
  description: string;
  imageData?: Uint8Array | null;
};

export const updateTitleEntry = async (
  id: string,
  { title, description, imageData }: UpdatePayload,
): Promise<NewsEntry> => {

  const payload: Record<string, unknown> = { title, description };

  if (typeof imageData !== "undefined") {
    payload.image_data = imageData ? bytesToHex(imageData) : null; // 👈 FIXED
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapRowToEntry(data as TitleRow);
};

// =========================================================
// DELETE
// =========================================================

export const deleteTitleEntry = async (id: string) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
  if (error) throw error;
};
