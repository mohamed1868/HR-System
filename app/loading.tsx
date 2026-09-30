import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </main>
  );
};

export default Loading;
