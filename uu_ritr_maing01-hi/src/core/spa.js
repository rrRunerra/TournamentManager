//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import Navbar from "../bricks/navbar.js";
import { NotificationProvider } from "../bricks/NotificationProvider.js";
import "../styles/spa.css"
//@@viewOff:imports

//@@viewOn:constants
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
const Login = Utils.Component.lazy(() => import("../routes/login.js"));
const Tournaments = Utils.Component.lazy(() => import("../routes/tournament.js"));
const Tournament = Utils.Component.lazy(() => import("../routes/tournament-detail.js"));
const History = Utils.Component.lazy(() => import("../routes/history.js"));

const ROUTE_MAP = {
  "": { redirect: "login" },
  home: (props) => <Home {...props} />,
  about: (props) => <About {...props} />,
  login: (props) => <Login {...props} />,
  tournaments: (props) => <Tournaments {...props} />,
  tournamentDetail: (props) => <Tournament {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
  history: (props) => <History {...props} />,
};
//@@viewOff:constants

const Spa = createVisualComponent({
  uu5Tag: Config.TAG + "Spa",

  render() {
    return (
      <NotificationProvider>
        <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]}>
          <Uu5Elements.ModalBus>
            {/* Obal pre flex layout */}
            <div className="spa-layout">
              <Navbar />
              <main className="spa-content">
                <Plus4U5App.Spa routeMap={ROUTE_MAP} displayTop={false} />
              </main>
              <footer className="app-footer">
                <p>© 2025 MatchUP. Všetky práva vyhradené.
                  <br />
                  Študentský projekt v spolupráci s firmou Unicorn</p>
              </footer>
            </div>
          </Uu5Elements.ModalBus>
        </Plus4U5.SpaProvider>
      </NotificationProvider>
    );
  },
});

export { Spa };
export default Spa;
