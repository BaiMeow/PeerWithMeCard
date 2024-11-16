import { useEffect, useState } from "react";
import dn11Logo from "./assets/dn11.png";
import "./App.css";
import { useInterval } from "@reactuses/core";
import { parse } from "yaml";
import { MingcuteQqLine, MdiEmailOutline } from "./icon";

interface uptime {
  code: number;
  msg: string;
  data: {
    as: Array<{
      asn: number;
      network: string[];
    }>;
    link: Array<{
      src: string;
      dst: string;
    }>;
  };
}

function App() {
  const asn = new URL(document.URL).searchParams.get("asn");
  if (!asn) {
    alert("no asn");
    return;
  }
  const [data, setData] = useState<{
    name: string;
    cidrs: string[];
    contact: string;
  } | null>();

  const [peers, setPeers] = useState<number | null>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://raw.githubusercontent.com/dn-11/registry/refs/heads/main/as/${asn}.yml`
    )
      .then((r) => r.text())
      .then((r) => {
        const data = parse(r);
        console.log(data);
        setData({
          name: data.name,
          cidrs: data.ip,
          contact: data.contact,
        });
      });
  }, [asn]);

  useInterval(
    () => {
      fetch("https://monitor.dn11.baimeow.cn/api/bgp")
        .then((a) => a.json())
        .then((a: uptime) => {
          setPeers(
            a.data.link.reduce(
              (p, c) => p + (c.dst == asn || c.src == asn ? 1 : 0),
              0
            )
          );
        });
    },
    60 * 1000,
    {
      immediate: true,
    }
  );

  useEffect(() => {
    setLoading(!(data && peers));
  }, [data, peers]);

  return loading ? (
    <>
      <h1>Loading...</h1>
    </>
  ) : (
    <>
      <div>
        <a href="https://dn11.top" target="_blank">
          <img src={dn11Logo} className="logo" alt="DN11 logo" />
        </a>
      </div>
      <div className="title">
        <h1>{data?.name}</h1>
        <h2>{asn}</h2>
      </div>
      <div
        className="cidr-box"
        onClick={() => (location.href = "https://status.dn11.top/#ospf/" + asn)}
      >
        {data?.cidrs.map((cidr) => (
          <p key={cidr} className="cidr">
            {cidr}
          </p>
        ))}
      </div>
      <a
        className="tail-line"
        href="https://status.dn11.top"
      >{`${peers} Neighbors`}</a>
      {data?.contact && <Contact contact={data.contact} />}
    </>
  );
}

function Contact(props: { contact: string }) {
  const { contact } = props;
  return (
    <a
      className="tail-line contact-line"
      href={contact.includes("@") ? "mailto:" + contact : "#"}
    >
      {contact.includes("@") ? (
        <MdiEmailOutline style={{ margin: ".3rem" }} />
      ) : (
        <MingcuteQqLine style={{ margin: ".3rem" }} />
      )}
      {contact}
    </a>
  );
}

export default App;
