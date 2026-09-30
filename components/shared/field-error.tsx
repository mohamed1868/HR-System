import { CircleAlert } from "lucide-react";

export const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlert className="size-3.5" />
      {message}
    </p>
  ) : null;
