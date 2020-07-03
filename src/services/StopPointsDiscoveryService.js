import { from } from 'rxjs';
import { mergeMap, reduce } from 'rxjs/operators';
import * as T from "../types";

const StopPointsDiscoveryService = {
    get: function (options) {
        let upperLeft = this.toTile(options[T.UPPER_LEFT_LONGITUDE], options[T.UPPER_LEFT_LATITUDE], T.ZOOM);
        let lowerRight = this.toTile(options[T.LOWER_RIGHT_LONGITUDE], options[T.LOWER_RIGHT_LATITUDE], T.ZOOM);
        let urls = [];
        for (let y = upperLeft[1]; y <= lowerRight[1]; y++) {
            for (let x = upperLeft[0]; x <= lowerRight[0]; x++) {
                let url = (process.env.NODE_ENV !== "production") ? "https://localhost" : ""
                url += "/siri-xlite/stoppoints-discovery/" + x + "/" + y;
                urls.push(url);
            }
        }

        return from(urls).pipe(
            mergeMap( url => this.request(url)),
            reduce((accumulator, value) => accumulator.concat(value))
        );
    },

    toTile: function (lon, lat, zoom) {
        let result = [Math.floor((lon + 180) / 360 * Math.pow(2, zoom)),
        Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))];
        return result;
    },

    request: function (url) {
        return from(fetch(url, {
            "Content-Type": "application/json"
        }).then(response => response.json()));
    }
};

export default StopPointsDiscoveryService;
