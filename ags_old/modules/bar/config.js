import { NetworkIndicator } from './network.js'
import { Volume } from './volume.js'
import { Weather } from './weather.js'
import { Bluetooth } from './bluetooth.js'
import { PowerButton } from './power_profile.js'
import { Media } from './music.js'
import { SysTray } from './systray.js'
import { BatteryLabel } from './battery.js'
import { MusicWindow } from './musiccontrols.js'
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';

const hyprland = await Service.import("hyprland")

function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id")
    const workspaces = hyprland.bind("workspaces")
        .as(ws => ws.map(({ id }) => Widget.Button({
            on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
            child: Widget.Label(`${id}`),
            class_name: activeId.as(i => `${i === id ? "focused" : ""}`),
        })))

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    })
}


function ClientTitle() {
    return Widget.Label({
        truncate: 'end',
        max_width_chars: 40,
        class_name: "client-title",
        label: hyprland.active.client.bind("title"),
    })
}

const time = Variable("", {
    poll: [1000, 'date "+%H:%M"'],
})
const date = Variable("", {
    poll: [1000, 'date "+%a %d %b"'],
})

function Clock() {
    return Widget.Box({
        class_name: "clock",
        children: [
            Widget.Label({
                class_name: "clock-date",
                label: date.bind(),
            }),
            Widget.Label({
                class_name: "clock-time",
                label: time.bind(),
            })
        ]
    })
}


// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
function Notification(monitor = 0) {
    const popups = Notifications.bind("popups")
    popups.monitor = monitor;
    return Widget.Box({
        class_name: "bar_notification",
        visible: popups.as(p => p.length > 0),
        children: [
            Widget.Icon({
                icon: "preferences-system-notifications-symbolic",
            }),
            Widget.Label({
                label: popups.as(p => p[0]?.summary || ""),
            }),
        ],
    })
}


const keyboard_layout = Variable("none");
hyprland.connect("keyboard-layout", (hyprland, keyboardname, layoutname) => {
    keyboard_layout.setValue(layoutname.trim().toLowerCase().substr(0, 2));
});

const KeyboardLayout = () => {
    return Widget.Box({
        class_name: "keyboard",
        child: Widget.Label({
            class_name: "keyboard-label",
            label: keyboard_layout.bind().as((c) => c == "none" ? "us" : c)
        })
    });
}
// layout of the bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            Workspaces(),
            ClientTitle(),
        ],
    })
}

function Center(monitor = 0) {
    return Widget.Box({
        spacing: 8,
        children: [
            // MediaIndicator(),
            MusicWindow(monitor),
            Media(monitor),
            Notification(monitor),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [
            // NetworkIndicator(),
            // Bluetooth()
            // PowerButton(),
            KeyboardLayout(),
            SysTray(),
            Weather(),
            Volume(),
            BatteryLabel(),
            Clock(),
        ],
    })
}

export const Bar = async (monitor = 0) => {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(monitor),
            end_widget: Right(),
        }),
    })
}
