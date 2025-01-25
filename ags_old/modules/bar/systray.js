import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
const { Gravity } = imports.gi.Gdk;

/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = (item) => item.id !== null ? Widget.Button({
    className: 'bar-systray-item',
    child: Widget.Icon().bind('icon', item, 'icon'),
    setup: (self) => self
        .hook(item, (self) => self.tooltipMarkup = item['tooltip-markup'])
    ,
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (btn, event) => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
}) : null;

export const SysTray = () => {
    const trayContent =  Widget.Box({
        setup: (self) => self
            .hook(SystemTray, (self) => {
                self.children = SystemTray.items.map(SysTrayItem);
                self.show_all();
            }),
    });
    const trayRevealer = Widget.Revealer({
        revealChild: true,
        transition: 'slide_left',
        transitionDuration: 0.2,
        child: trayContent,
    });

    return Widget.Box({
        children: [trayRevealer],
    });

}