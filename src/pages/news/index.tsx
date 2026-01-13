import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const fileToBytes = async (file: File) => {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
};

export type NewsFormSubmitValues = {
  title: string;
  description: string;
  imageBytes?: Uint8Array | null;
};

type NewsFormProps = {
  mode: "create" | "edit";
  submitting?: boolean;
  initialValues?: {
    title?: string;
    description?: string;
    imageUrl?: string | null;
  };
  onSubmit: (payload: NewsFormSubmitValues) => Promise<void> | void;
};

const NewsForm: React.FC<NewsFormProps> = ({
  mode,
  submitting = false,
  initialValues,
  onSubmit,
}) => {
  const [values, setValues] = useState({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    });
    setImageFile(null);
    setPreviewUrl(initialValues?.imageUrl ?? null);
  }, [initialValues?.title, initialValues?.description, initialValues?.imageUrl]);

  useEffect(
    () => () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : initialValues?.imageUrl ?? null);
  };

  const canSubmit = useMemo(
    () => Boolean(values.title.trim()) && Boolean(values.description.trim()),
    [values.description, values.title],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setLocalError("Title and description are required.");
      return;
    }

    setLocalError(null);
    const imageBytes = imageFile ? await fileToBytes(imageFile) : undefined;
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        imageBytes,
      });
    } catch {
      // Parent handles error messaging; swallow to prevent unhandled rejection warnings.
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          value={values.title}
          onChange={handleInputChange}
          required
          fullWidth
          InputProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: "rgba(4,8,20,0.6)",
              color: "#fff5ea",
              "& fieldset": {
                borderColor: "rgba(255,245,234,0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,245,234,0.35)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#d4a017",
              },
            },
          }}
        />

        <TextField
          label="Description"
          name="description"
          value={values.description}
          onChange={handleInputChange}
          required
          multiline
          minRows={4}
          fullWidth
          InputProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: "rgba(4,8,20,0.6)",
              color: "#fff5ea",
              "& fieldset": {
                borderColor: "rgba(255,245,234,0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,245,234,0.35)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#d4a017",
              },
            },
          }}
        />

        <Box>
          <Button
            component="label"
            variant="outlined"
            color="secondary"
            sx={{ mr: 2, borderRadius: 3, px: 3 }}
          >
            {imageFile ? "Replace image" : previewUrl ? "Change image" : "Upload image"}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          <Typography variant="caption" sx={{ color: "rgba(255,245,234,0.7)" }}>
            {imageFile
              ? imageFile.name
              : previewUrl
                ? "Existing image attached"
                : "No image selected"}
          </Typography>
          {previewUrl && (
            <Box
              component="img"
              src={previewUrl}
              alt="Selected preview"
              sx={{
                display: "block",
                mt: 2,
                width: "100%",
                maxHeight: 240,
                objectFit: "cover",
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          )}
        </Box>

        {localError && (
          <Typography variant="body2" color="error">
            {localError}
          </Typography>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={submitting || !canSubmit}
            sx={{ minWidth: 140, fontWeight: 700 }}
          >
            {submitting ? "Saving..." : mode === "create" ? "Publish" : "Save changes"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NewsForm;



