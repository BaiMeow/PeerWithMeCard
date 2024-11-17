import { ClientOnly } from "./client";
export default function Page() {
  return <ClientOnly />;
}

export function generateStaticParams() {
  return [{ slug: [""] }];
}
