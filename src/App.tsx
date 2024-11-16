import { useEffect, useState } from "react";
import dn11Logo from "./assets/dn11.png";
import "./App.css";
import { useInterval } from "@reactuses/core";
import { parse } from "yaml";
import { MingcuteQqLine, MdiEmailOutline } from "./icon";

interface metadata {
  announcements: {
    assigned: Array<{
      prefix: string;
      asn: string;
    }>;
    public: Array<{
      prefix: string;
      service: Array<{
        prefix: string;
        usage: string;
        allowedASN: Array<string>;
      }>;
    }>;
    "iplist.RESERVED": Array<string>;
  };
  metadata: {
    [key: string]: {
      display: string;
      monitor?: any;
    };
  };
}

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
    <><h1>Loading...</h1></>
  ) : (
    <>
      <div>
        <a href="https://dn11.top" target="_blank">
          <img src={dn11Logo} className="logo" alt="DN11 logo" />
        </a>
      </div>
      <h1>{data?.name}</h1>
      <div className="peer-line">
        {`${asn} has peered `}
        <a href="https://status.dn11.top">{peers || ""}</a>
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
      {!data?.contact || (
        <a
          className="contact-line"
          href={data.contact.includes("@") ? "mailto:" + data.contact : "#"}
        >
          {
            <>
              {data.contact.includes("@") ? (
                <MdiEmailOutline style={{ margin: ".3rem" }} />
              ) : (
                <MingcuteQqLine style={{ margin: ".3rem" }} />
              )}
              {data.contact}
            </>
          }
        </a>
      )}
    </>
  );
}

export default App;
