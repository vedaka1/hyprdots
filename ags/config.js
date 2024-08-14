import Gdk from 'gi://Gdk';
import GLib from 'gi://GLib';
import App from 'resource:///com/github/Aylur/ags/app.js'
import { Bar } from './modules/bar/config.js'
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { NotificationPopups } from './modules/notifications/config.js'
import { applauncher } from './modules/applauncher/config.js'
const COMPILED_STYLE_DIR = `${GLib.get_user_cache_dir()}/ags/user/generated`


const range = (length, start = 1) => Array.from({ length }, (_, i) => i + start);

function forMonitorsAsync(widget) {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
    return range(n, 0).forEach((n) => widget(n).catch(print))
}
function applyStyle() {
    Utils.exec(`mkdir -p "${GLib.get_user_state_dir()}/ags/scss"`);
    Utils.exec(`mkdir -p ${COMPILED_STYLE_DIR}`);
    Utils.exec(`sass -I "${GLib.get_user_state_dir()}/ags/scss" -I "${App.configDir}/scss/fallback" "${App.configDir}/scss/main.scss" "${COMPILED_STYLE_DIR}/style.css"`);
    App.resetCss();
    App.applyCss(`${COMPILED_STYLE_DIR}/style.css`);
    console.log('[LOG] Styles loaded')
}
applyStyle();

App.config({
    css: `${COMPILED_STYLE_DIR}/style.css`,
    windows: [
        NotificationPopups(),
        applauncher,
    ],
});

forMonitorsAsync(Bar)

