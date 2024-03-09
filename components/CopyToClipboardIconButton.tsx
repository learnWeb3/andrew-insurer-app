import { IconButton } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useEffect, useState } from "react";
import { successToast } from "../lib/toast.helpers";

export interface CopyToClipboardIconButtonProps {
  text: string;
  successMessage: string;
}

export function CopyToClipboardIconButton({
  text,
  successMessage,
}: CopyToClipboardIconButtonProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let timeoutRef: string | number | NodeJS.Timeout | null | undefined = null;
    if (copied) {
      timeoutRef = setTimeout(() => setCopied(false), 1000);
    }
    return () => {
      timeoutRef && clearTimeout(timeoutRef);
    };
  }, [copied]);
  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={() => {
        navigator.permissions
          .query({ name: "clipboard-write" as PermissionName })
          .then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
              navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                successToast(successMessage);
              });
            }
          });
      }}
      edge="end"
    >
      {copied ? (
        <CheckOutlinedIcon color="success" />
      ) : (
        <ContentCopyOutlinedIcon />
      )}
    </IconButton>
  );
}
