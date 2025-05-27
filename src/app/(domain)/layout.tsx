import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CustomClientProvider } from "@/components/custom-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";

export default function DomainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <CustomClientProvider>
        <Toaster />
        <ScrollArea className="relative h-full overflow-y-scroll">
          {children}
        </ScrollArea>
      </CustomClientProvider>
    </NuqsAdapter>
  );
}
