import { ClientOnly } from "./client";
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense>
      <ClientOnly />
    </Suspense>
  );
}

export function generateStaticParams() {
  return [{ slug: [""] }];
}
