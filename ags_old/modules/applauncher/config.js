const { Gdk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

const applications = await Service.import('applications')
import { DesktopEntryButton } from './searchbuttons.js';
const WINDOW_NAME = "applauncher"
const MAX_RESULTS = 5
// /** @param {import('resource:///com/github/Aylur/ags/service/applications.js').Application} app */

export const SearchAndWindows = () => {
    var _appSearchResults = [];

    const resultsBox = Widget.Box({
        hpack: 'start',
        className: 'overview-search-results',
        vertical: true,
    });
    const resultsRevealer = Widget.Revealer({
        transitionDuration: 0.1,
        revealChild: false,
        transition: 'slide_down',
        // duration: 200,
        hpack: 'start',
        child: resultsBox,
    });
    const entryPromptRevealer = Widget.Revealer({
        transition: 'crossfade',
        transitionDuration: 0.5,
        revealChild: true,
        hpack: 'end',
        child: Widget.Label({
            className: 'overview-search-prompt txt-large txt',
            label: 'Type to search'
        }),
    });
    const entryIconRevealer = Widget.Revealer({
        transition: 'crossfade',
        transitionDuration: 0.5,
        revealChild: false,
        hpack: 'end',
        child: Widget.Label({
            className: 'txt txt-large icon-material overview-search-icon',
            label: 'Search',
        }),
    });

    const entryIcon = Widget.Box({
        className: 'overview-search-prompt-box',
        setup: box => box.pack_start(entryIconRevealer, true, true, 0),
    });
    const entry = Widget.Entry({
        className: 'overview-search-box txt-small txt',
        hpack: 'center',
        onAccept: (self) => { // This is when you hit Enter
            resultsBox.children[0].onClicked();
        },
        onChange: (entry) => { // this is when you type
            const isAction = entry.text[0] == '>';
            const isDir = (['/', '~'].includes(entry.text[0]));
            resultsBox.get_children().forEach(ch => ch.destroy());

            // check empty if so then dont do stuff
            if (entry.text == '') {
                resultsRevealer.revealChild = false;
                entryPromptRevealer.revealChild = true;
                entryIconRevealer.revealChild = false;
                entry.toggleClassName('overview-search-box-extended', false);
                return;
            }
            const text = entry.text;
            resultsRevealer.revealChild = true;
            entryPromptRevealer.revealChild = false;
            entryIconRevealer.revealChild = true;
            entry.toggleClassName('overview-search-box-extended', true);
            _appSearchResults = applications.query(text);

            // Add application entries
            let appsToAdd = MAX_RESULTS;
            _appSearchResults.forEach(app => {
                if (appsToAdd == 0) return;
                resultsBox.add(DesktopEntryButton(app));
                appsToAdd--;
            });

            // Fallbacks
            // if the first word is an actual command
            resultsBox.show_all();
        },
    });
    return Widget.Box({
        vertical: true,
        children: [
            Widget.Box({
                hpack: 'center',
                children: [
                    entry,
                    Widget.Box({
                        className: 'overview-search-icon-box',
                        setup: (box) => {
                            box.pack_start(entryPromptRevealer, true, true, 0)
                        },
                    }),
                    entryIcon,
                ]
            }),
            resultsRevealer,
        ],
        setup: (self) => self
            .hook(App, (_b, name, visible) => {
                if (name == 'overview' && !visible) {
                    resultsBox.children = [];
                    entry.set_text('');
                }
            })
            .on('key-press-event', (widget, event) => { // Typing
                const keyval = event.get_keyval()[1];
                const modstate = event.get_state()[1];
                if (!(modstate & Gdk.ModifierType.CONTROL_MASK)) { // Ctrl not held
                    if (keyval >= 32 && keyval <= 126 && widget != entry) {
                        Utils.timeout(1, () => entry.grab_focus());
                        entry.set_text(entry.text + String.fromCharCode(keyval));
                        entry.set_position(-1);
                    }
                }
            })
        ,
    });
};

// there needs to be only one instance
export const AppLauncher = () => {
    return Widget.Window({
        name: WINDOW_NAME,
        class_name: "applauncher-body",
        setup: self => self.keybind("Escape", () => {
            App.closeWindow(WINDOW_NAME)
        }),
        visible: false,
        keymode: "exclusive",
        child: SearchAndWindows(),
    })
}