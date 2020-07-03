import { from } from 'rxjs';

const EstimatedTimetableService = {
    get: function (options) {
        let url = (process.env.NODE_ENV !== "production") ? "http://127.0.0.1:8080" : ""
        url += "/siri-lite/estimated-timetable"
        url += options && "?" + Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&');
        return this.request(url);
    },

    request: function (url) {
        console.log("request " + url)
        return from(fetch(url, {
            "Content-Type": "application/json"
        }).then(response => response.json()));
    }
};

export default EstimatedTimetableService;