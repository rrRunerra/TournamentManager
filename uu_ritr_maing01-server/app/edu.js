export class Edu {
  name;
  password;
  typ;
  edupageLink;
  esid;

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  async login() {
    const payload = {
      m: this.name,
      h: this.password,
      edupage: "",
      plgc: null,
      ajheslo: "1",
      hasujheslo: "1",
      ajportal: "1",
      ajportallogin: "1",
      mobileLogin: "1",
      version: "2020.0.18",
      fromEdupage: "",
      device_name: null,
      device_id: null,
      device_key: "",
      os: null,
      murl: null,
      edid: "",
    };

    try {
      const response = await fetch("https://login1.edupage.org/login/mauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0",
        },
        body: new URLSearchParams(payload).toString(),
      });

      const json = await response.json();
      //console.log("Login Response:", JSON.stringify(json, null, 2));

      if (json.users && json.users.length > 0) {
        console.log("Login Successful!");
        console.log("User ID:", json.users[0].userid);
        console.log("Session ID:", json.users[0].esid);
        this.edupageLink = json.users[0].edupage;
        this.typ = json.users[0].typ;
        this.esid = json.users[0].esid;
      } else {
        console.log("Login Failed: Invalid credentials or other error.");
      }
      return json;
    } catch (error) {
      console.error("Login Error:", error);
    }
  }

  async getClass() {
    const response = await fetch(`https://${this.edupageLink}.edupage.org/user/?`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Cookie: `PHPSESSID=${this.esid}`,
      },
    });
    const content = await response.text();
    const e = this.eduParse(content);
    // e object keys
    //     [
    //   'items',          'introurl',
    //   'userProps',      'dbi',
    //   'isLoginSkin',    'vyucovacieDni',
    //   'userrow',        'buttons',
    //   'postUrl',        'eventTypes',
    //   'userid',         'userGroups',
    //   'dp',             'zvonenia',
    //   'sliderEnabled',  'videoUrl',
    //   'spe',            'zobrazRozvrh',
    //   'zobrazKalendar', 'events',
    //   'tips',           'showAgendaConvert',
    //   'school_email',   'showOldDesignWarning',
    //   'etestEnabled',   'updateInterval',
    //   '_edubar'
    // ]

    const user = e.userrow;
    const classes = e.dbi.classes;

    const classList = [];
    for (const key in classes) {
      const d = classes[key];
      classList.push({
        short: d.short,
        id: d.id,
      });
    }

    return {
      class: classes[user.TriedaID].short,
      classes: classList,
    };
  }

  parse(html) {
    const data = {};
    const matches = [...html.matchAll(/ASC\.([a-zA-Z0-9_$]+)\s?=\s?([\s\S]+?);/g)];

    if (!matches.length) return FatalError.throw(new ParseError("Failed to parse ASC data from html"), { html });

    for (const [match, key, value] of matches) {
      if (value.startsWith("function")) continue;

      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        return FatalError.throw(new ParseError("Failed to parse JSON from ASC html"), {
          html,
          matches,
          match,
          key,
          value,
          e,
        });
      }
    }

    return data;
  }

  eduParse(html) {
    let data = {
      _edubar: {},
    };

    const match = (html.match(/\.userhome\((.+?)\);$/m) || "")[1];
    if (!match) return FatalError.throw(new ParseError("Failed to parse Edupage data from html"), { html });

    try {
      data = { ...JSON.parse(match) };
    } catch (e) {
      return FatalError.throw(new ParseError("Failed to parse JSON from Edupage html"), { html, match, e });
    }

    //Parse additional edubar data
    const match2 = (html.match(/edubar\(([\s\S]*?)\);/) || "")[1];
    if (!match2) return FatalError.throw(new ParseError("Failed to parse edubar data from html"), { html });

    try {
      data._edubar = JSON.parse(match2) || {};
    } catch (e) {
      return FatalError.throw(new ParseError("Failed to parse JSON from edubar html"), { html, match2, e });
    }

    return data;
  }
}
