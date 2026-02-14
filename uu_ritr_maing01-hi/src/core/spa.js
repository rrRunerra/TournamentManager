import React, { useEffect } from "react";
//@@viewOn:imports
import { createVisualComponent, Utils, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import Navbar from "../bricks/navbar.js";
import { NotificationProvider } from "../context/NotificationContext.js";
import { ConfirmProvider } from "../bricks/components/confirm/ConfirmProvider.js";
import importLsi from "../lsi/import-lsi.js";
import "../styles/spa.css";
//@@viewOff:imports

//@@viewOn:constants
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const Login = Utils.Component.lazy(() => import("../routes/login.js"));
const Tournaments = Utils.Component.lazy(() => import("../routes/tournament.js"));
const Tournament = Utils.Component.lazy(() => import("../routes/tournament-detail.js"));
const History = Utils.Component.lazy(() => import("../routes/history.js"));
const Profile = Utils.Component.lazy(() => import("../routes/profile.js"));
const Test = Utils.Component.lazy(() => import("../routes/test.js"));
const Leaderboard = Utils.Component.lazy(() => import("../routes/leaderboard.js"));

const ROUTE_MAP = {
  "": { redirect: "home" },
  home: (props) => <Home {...props} />,
  about: (props) => <About {...props} />,
  login: (props) => <Login {...props} />,
  tournaments: (props) => <Tournaments {...props} />,
  tournamentDetail: (props) => <Tournament {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
  history: (props) => <History {...props} />,
  profile: (props) => <Profile {...props} />,
  test: (props) => <Test {...props} />,
  leaderboard: (props) => <Leaderboard {...props} />,
};
//@@viewOff:constants

const Spa = createVisualComponent({
  uu5Tag: Config.TAG + "Spa",

  render() {
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const now = Date.now() / 1000;
          if (payload.exp && payload.exp < now) {
            console.log("Token expired, logging out...");
            localStorage.removeItem("token");
            window.location.reload();
          }
        } catch (e) {
          console.error("Invalid token format", e);
          localStorage.removeItem("token");
        }
      }
    }, []);

    return (
      <Plus4U5.SpaProvider initialLanguageList={["gb", "cz", "sk", "jp", "zh", "ru", "de", "pl", "hu"]}>
        <NotificationProvider>
          <ConfirmProvider>
            <Uu5Elements.ModalBus>
              {/* Obal pre flex layout */}
              <div className="spa-layout">
                <Navbar />
                <main className="spa-content">
                  <Plus4U5App.Spa routeMap={ROUTE_MAP} displayTop={false} />
                </main>
                <footer className="app-footer">
                  <p>
                    <Lsi import={importLsi} path={["Footer", "copyright"]} />
                    <br />
                    <Lsi import={importLsi} path={["Footer", "collaboration"]} />
                  </p>
                </footer>
              </div>
            </Uu5Elements.ModalBus>
          </ConfirmProvider>
        </NotificationProvider>
      </Plus4U5.SpaProvider>
    );
  },
});

export { Spa };
export default Spa;
