import React from "react";

const ThanksSection = ({ lsi, className }) => {
  return (
    <div className={`thanks-section ${className || ""}`}>
      <h2 className="thanks-title">{lsi.thanksTitle}</h2>
      <p className="thanks-text">{lsi.thanksText}</p>
      <div className="special-thanks">
        <p className="thanks-people">
          {lsi.specialThanks || "Špeciálne poďakovanie patri:"}{" "}
          <a
            href="https://www.linkedin.com/in/ali-al-alawin/"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Ali Al Alawin
          </a>
          {", "}
          <a
            href="https://www.linkedin.com/in/vanesa-smoľakov%C3%A1-962abb39b/"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Vanesa Smoľaková
          </a>
          {" a "}
          <br />
          <a
            href="https://www.linkedin.com/in/mária-ortutayová-466229ba/"
            target="_blank"
            rel="noopener noreferrer"
            className="thanks-link"
          >
            Ing. Mária Ortutayová
          </a>
        </p>
        <p className="thanks-appreciation">{lsi.thanksAppreciation || "Bez nich by nič z toho nebolo možné. 💛"}</p>
      </div>
    </div>
  );
};

export default ThanksSection;
