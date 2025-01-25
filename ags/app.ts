import { App, Widget } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widgets/bar/Bar"
import NotificationPopups from "./widgets/notifications/NotificationPopups"
import MprisPlayers from "./widgets/mediaplayer/MediaPlayer"
import Applauncher from "./widgets/applauncher/AppLauncher"

App.start({
    css: style,
    main() {
        App.get_monitors().forEach((monitor) => {
            Bar(monitor);
            NotificationPopups(monitor);
        });
        Applauncher();
    },
})

// App.start({
//     instanceName: "launcher",
//     css: style,
//     main: Applauncher,
// })