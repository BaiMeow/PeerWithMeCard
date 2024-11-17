import { useEffect, useState } from "react";
import "./App.css";
import { useInterval } from "@reactuses/core";
import { MingcuteQqLine, MdiEmailOutline } from "../icon";
import logo from "./logo.png";
import { ghraw } from "./ghraw";
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

export type Data = {
  asn: string;
  name: string;
  cidrs: string[];
  contact: string;
};

function App() {
  const asn = new URL(document.URL).searchParams.get("asn");
  if (!asn) {
    alert("no asn");
    return;
  }

  const [peers, setPeers] = useState<number | null>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    ghraw(asn).then((d) => {
      setData(d);
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
          <img src={logo.src} className="logo" alt="DN11 logo" />
        </a>
      </div>
      <div className="title">
        <h1>{data?.name}</h1>
        <h2>{data?.asn}</h2>
      </div>
      <div
        className="cidr-box"
        onClick={() =>
          (location.href = `https://status.dn11.top/#/ospf/${asn}`)
        }
      >
        {data?.cidrs.map((cidr) => (
          <p key={cidr} className="cidr">
            {cidr}
          </p>
        ))}
      </div>
      <a
        className="tail-line"
        href={`https://status.dn11.top/#/bgp/${asn}`}
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