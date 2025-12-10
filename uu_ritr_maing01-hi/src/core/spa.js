//@@viewOn:imports
import { createVisualComponent, Utils, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import Navbar from "../bricks/navbar.js";
import { NotificationProvider } from "../bricks/NotificationProvider.js";
import { ConfirmProvider } from "../bricks/ConfirmProvider.js";
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
};
//@@viewOff:constants

const Spa = createVisualComponent({
  uu5Tag: Config.TAG + "Spa",

  render() {
    return (
      <NotificationProvider>
        <ConfirmProvider>
          <Plus4U5.SpaProvider initialLanguageList={["en", "cz", "sk", "ja", "zh", "ru", "de", "pl", "hu"]}>
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
          </Plus4U5.SpaProvider>
        </ConfirmProvider>
      </NotificationProvider>
    );
  },
});

export { Spa };
export default Spa;
