import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CustomClientProvider } from "@/components/custom-client-provider";
import { Toaster } from "@/components/ui/sonner";

export default function DomainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <Toaster />
      <CustomClientProvider>{children}</CustomClientProvider>
    </NuqsAdapter>
  );
}
