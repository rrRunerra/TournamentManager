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

  async getSchoolData() {
    const response = await fetch(`https://${this.edupageLink}.edupage.org/user/?`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Cookie: `PHPSESSID=${this.esid}`,
      },
    });
    const content = await response.text();

    let e;

    try {
      e = this.eduParse(content);
    } catch (error) {
      console.error("Error parsing school data:", error);
    }
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
    if (!user) {
      console.error("Parsed data is missing userrow:", e);
      throw new Error("Failed to extract user information (userrow missing)");
    }

    const classes = e.dbi?.classes || {};
    const classRooms = e.dbi?.classrooms || {};

    console.log("Classes:", classes);
    console.log("ClassRooms:", classRooms);

    const classList = [];
    for (const key in classes) {
      const d = classes[key];
      classList.push({
        short: d.short,
        id: d.id,
      });
    }

    const classRoomList = [];
    for (const key in classRooms) {
      const d = classRooms[key];
      classRoomList.push({
        id: d.id,
        name: d.name,
        short: d.short,
      });
    }

    return {
      class: user.role === "student" ? classes[user.TriedaID].short : null,
      classes: classList,
      classRooms: classRoomList.filter((n) => n.name != ""),
    };
  }

  parse(html) {
    const data = {};
    const matches = [...html.matchAll(/ASC\.([a-zA-Z0-9_$]+)\s?=\s?([\s\S]+?);/g)];

    if (!matches.length) {
      console.error("Failed to parse ASC data from html (no matches)");
      return {};
    }

    for (const [match, key, value] of matches) {
      if (value.startsWith("function")) continue;

      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        console.error(`Failed to parse JSON for key ${key}:`, e);
        // Don't throw here, just continue with other keys if some fail
        continue;
      }
    }

    return data;
  }

  eduParse(html) {
    let data = {
      _edubar: {},
    };

    // Use a more robust regex that anchors to the end of the line (multiline mode)
    // This prevents cutting off at ); inside JSON strings.
    const match = (html.match(/\.userhome\(([\s\S]+?)\);\s*$/m) || html.match(/\.userhome\(([\s\S]+?)\);/) || "")[1];
    if (!match) {
      throw new Error("Failed to parse Edupage data from html (userhome match not found)");
    }

    try {
      data = { ...JSON.parse(match) };
    } catch (e) {
      console.error("JSON parse error in userhome data:", e);
      throw new Error("Failed to parse JSON from Edupage html (.userhome)");
    }

    // Parse additional edubar data
    // Again, anchor to end of line to handle ); inside strings
    const match2 = (html.match(/edubar\(([\s\S]*?)\);\s*$/m) || html.match(/edubar\(([\s\S]*?)\);/) || "")[1];
    if (!match2) {
      console.warn("edubar data not found in html");
    } else {
      try {
        data._edubar = JSON.parse(match2) || {};
      } catch (e) {
        console.error("JSON parse error in edubar data:", e);
        // It's possible edubar is just too complex or broken, we can continue without it if userhome worked
      }
    }

    return data;
  }
}
