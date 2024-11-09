import { NetworkIndicator } from './network.js'
import { Volume } from './volume.js'
import { Weather } from './weather.js'
import { Bluetooth } from './bluetooth.js'
import { PowerButton } from './power_profile.js'

const hyprland = await Service.import("hyprland")
const notifications = await Service.import("notifications")
const mpris = await Service.import("mpris")
const battery = await Service.import("battery")
const systemtray = await Service.import("systemtray")

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
function Notification() {
    const popups = notifications.bind("popups")
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


function Media() {
    const label = Utils.watch("", mpris, "player-changed", () => {
        if (mpris.players[0]) {
            const { track_artists, track_title } = mpris.players[0]
            return `${track_artists.join(", ")} - ${track_title}`
        } else {
            return "Nothing is playing"
        }
    })

    return Widget.Button({
        class_name: "media",
        on_primary_click: () => mpris.getPlayer("")?.playPause(),
        on_scroll_up: () => mpris.getPlayer("")?.next(),
        on_scroll_down: () => mpris.getPlayer("")?.previous(),
        child: Widget.Label({ label }),
    })
}

function BatteryLabel() {
    const batIcon = Utils.merge([
        battery.bind("percent"),
        battery.bind("charging"),
        battery.bind("charged")
    ],
    (batPercent, batCharging, batCharged) => {
        if (batCharged)
            return `battery-level-100-charged-symbolic`;
        else
            return `battery-level-${Math.floor(batPercent / 10) * 10}${batCharging ? '-charging' : ''}-symbolic`;
    });
    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        tooltip_text: battery.bind("time_remaining").as((t) => t.toString()),
        children: [
            Widget.Icon({ icon: batIcon }),
            Widget.Label({
                className: 'battery-percentage',
                setup: (self) => self.hook(battery, label => {
                    label.label = `${Number.parseFloat(battery.percent.toFixed(1))}%`;
                }),
            }),
        ],
    })
}

/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = item => Widget.Button({
    child: Widget.Icon().bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
});

const SysTray = () => {
    return Widget.Box({
        children: systemtray.bind('items').as(i => i.map(SysTrayItem))
    })
}

// function SysTray() {
//     const items = systemtray.bind("items")
//     .as(items => items.map(item => Widget.Button({
//         child: Widget.Icon(
//             {
//                 icon: item.bind("icon")
//             }),
//             on_primary_click: (_, event) => item.activate(event),
//             on_secondary_click: (_, event) => item.openMenu(event),
//             tooltip_markup: item.bind("tooltip_markup"),
//         })))

//     return Widget.Box({
//         class_name: "systray",
//         children: items,
//     })
// }
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

function Center() {
    return Widget.Box({
        spacing: 8,
        children: [
            Media(),
            Notification(),
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
            center_widget: Center(),
            end_widget: Right(),
        }),
    })
}
