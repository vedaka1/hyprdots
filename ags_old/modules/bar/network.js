import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const network = await Service.import('network')
const WifiIndicator = () => {
    return Widget.Button({
        class_name: "network_button",
        child: Widget.Icon({
            icon: network.wifi.bind('icon_name'),
        }),
        tooltip_markup: network.wifi.bind('ssid'),
    })
}

const WiredIndicator = () => Widget.Icon({
    icon: network.wired.bind('icon_name'),
})

export const NetworkIndicator = () => Widget.Stack({
    children: [
        WifiIndicator(),
        WiredIndicator(),
    ],
    shown: network.bind('primary').as(p => p || 'wifi'),
})