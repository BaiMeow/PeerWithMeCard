"use server";
import { parse } from "yaml";
import { Data } from "./App";

export async function ghraw(asn: string): Promise<Data> {
  const resp = await fetch(
    `https://raw.githubusercontent.com/dn-11/registry/refs/heads/main/as/${asn}.yml`
  );
  const txt = await resp.text();
  const data = parse(txt);
  return {
    asn: asn,
    name: data.name,
    cidrs: data.ip,
    contact: data.contact,
  };
}
