
export class Edu {
    name;
    password;

    constructor(name, password) {
        this.name = name;
        this.password = password;
    }

    async login() {
        const payload = {
            "m": this.name,
            "h": this.password,
            "edupage": "",
            "plgc": null,
            "ajheslo": "1",
            "hasujheslo": "1",
            "ajportal": "1",
            "ajportallogin": "1",
            "mobileLogin": "1",
            "version": "2020.0.18",
            "fromEdupage": "",
            "device_name": null,
            "device_id": null,
            "device_key": "",
            "os": null,
            "murl": null,
            "edid": ""
        };

        try {
            const response = await fetch("https://login1.edupage.org/login/mauth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0"
                },
                body: new URLSearchParams(payload).toString()
            });

            const json = await response.json();
            //console.log("Login Response:", JSON.stringify(json, null, 2));


            // if (json.users && json.users.length > 0) {
            //     console.log("Login Successful!");
            //     console.log("User ID:", json.users[0].userid);
            //     console.log("Session ID:", json.users[0].esid);
            // } else {
            //     console.log("Login Failed: Invalid credentials or other error.");
            // }
            return json;

        } catch (error) {
            console.error("Login Error:", error);
        }
    }
}


