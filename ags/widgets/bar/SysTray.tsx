import { bind } from "astal"
import { Gtk } from "astal/gtk3"
import Tray from "gi://AstalTray"

function SysTrayItem (item: Tray.TrayItem): void | Gtk.Widget {
    return (
        <menubutton
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
            actionGroup={bind(item, "action-group").as(ag => ["dbusmenu", ag])}
            menuModel={bind(item, "menu-model")}
            >
            <icon gicon={bind(item, "gicon")} />
        </menubutton>
    )
    // if (item.id == null) {
    //     null
    // } else {
    //     return template
    // }
}

export default function SysTray(): Gtk.Widget {
    const tray = Tray.get_default()

    return <box className="SysTray">
        {bind(tray, "items").as(items => items.map((item) => (
            SysTrayItem(item)
        )))}
    </box>
}