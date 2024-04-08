import App from 'resource:///com/github/Aylur/ags/app.js'
import Notifications from './widgets/notifications.js' 
import Bar from './widgets/bar.js'


function applyStyle() {
    App.resetCss();
    App.applyCss(`${App.configDir}/style.css`);
    console.log('[LOG] Styles loaded')
}
applyStyle();


export default {
    css: `${App.configDir}/style.css`,
    windows: [
        // Notifications(),
        Bar()
    ],
};