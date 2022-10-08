import { useEffect, useRef, useState } from "react";
import "./index.css";
import refreshSvg from "../../assets/svg/refresh.svg";

export const Quote = () => {
  const controller = useRef(null);
  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    controller.current?.abort();
    controller.current = new AbortController();

    try {
      const res = await fetch("https://api.quotable.io/random", {
        signal: controller.current.signal,
      });
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchQuote();
    return () => {
      controller.current?.abort();
    };
  }, []);

  if (!quote) return null;

  return (
    <div className="quote_container">
      <div className="quote_data">
        <p className="quote_text">
          <q>{quote.content}</q>
        </p>
        <p className="quote_meta">{quote.author}</p>
      </div>
      <button className="quote_refresh_btn" onClick={() => fetchQuote()}>
        <img src={refreshSvg} />
      </button>
    </div>
  );
};
