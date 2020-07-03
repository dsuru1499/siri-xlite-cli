import { from } from 'rxjs';

const LinesDiscoveryService = {
    get: function (options) {
        let url = (process.env.NODE_ENV !== "production") ? "https://localhost:8443" : ""
        url += "/siri-lite/lines-discovery";
        url += options && "?" + Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&');
        return  this.request(url)
    },

    request: function (url) {
        console.log("request " + url)
        return from(fetch(url, {
            "Content-Type": "application/json"
        }).then(response => response.json()));
    }
};

export default LinesDiscoveryService;
