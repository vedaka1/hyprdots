import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';


export const BatteryLabel = () => {
    const batIcon = Utils.merge([
        Battery.bind("percent"),
        Battery.bind("charging"),
        Battery.bind("charged")
    ],
    (batPercent, batCharging, batCharged) => {
        if (batCharged)
            return `battery-level-100-charged-symbolic`;
        else
            return `battery-level-${Math.floor(batPercent / 10) * 10}${batCharging ? '-charging' : ''}-symbolic`;
    });
    return Widget.Box({
        class_name: "battery",
        visible: Battery.bind("available"),
        tooltip_text: Battery.bind("time_remaining").as((t) => t.toString()),
        children: [
            Widget.Icon({ icon: batIcon }),
            Widget.Label({
                className: 'battery-percentage',
                setup: (self) => self.hook(Battery, label => {
                    label.label = `${Number.parseFloat(Battery.percent.toFixed(1))}%`;
                }),
            }),
        ],
    })
}
