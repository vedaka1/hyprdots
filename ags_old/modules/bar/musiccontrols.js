import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { showMusicControls } from '../../init.js';
import { trimTrackTitle } from './music.js'
import Indicator from '../../services/indicator.js'

export const getPlayer = (name = userOptions.music.preferredPlayer) => Mpris.getPlayer(name) || Mpris.players[0] || null;
var lastCoverPath = '';

function lengthStr(length) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? '0' : '';
    return `${min}:${sec0}${sec}`;
}

const TrackTime = ({ player, ...rest }) => {
    return Widget.Revealer({
        revealChild: false,
        transition: 'slide_left',
        transitionDuration: 0.3,
        child: Widget.Box({
            ...rest,
            vpack: 'center',
            className: 'osd-music-pill',
            children: [
                Widget.Label({
                    setup: (self) => self.poll(1000, (self) => {
                        // const player = Mpris.getPlayer();
                        if (!player) return;
                        self.label = lengthStr(player.position);
                    }),
                }),
                Widget.Label({ label: '/' }),
                Widget.Label({
                    setup: (self) => self.hook(Mpris, (self) => {
                        // const player = Mpris.getPlayer();
                        if (!player) return;
                        self.label = lengthStr(player.length);
                    }),
                }),
            ],
        }),
        setup: (self) => self.hook(Mpris, (self) => {
            if (!player) self.revealChild = false;
            else self.revealChild = true;
        }),
    })
}
const TrackControls = ({ player, ...rest }) => Widget.Revealer({
    revealChild: false,
    transition: 'slide_right',
    transitionDuration: 0.2,
    child: Widget.Box({
        ...rest,
        vpack: 'center',
        className: 'osd-music-controls spacing-h-3',

        children: [
            Widget.Button({
                className: 'osd-music-controlbtn',
                onClicked: () => player.previous(),
                child: Widget.Label({
                    className: 'icon-material osd-music-controlbtn-txt',
                    label: '󰒮',
                })
            }),
            Widget.Button({
                className: 'osd-music-controlbtn',
                onClicked: () => player.next(),
                child: Widget.Label({
                    className: 'icon-material osd-music-controlbtn-txt',
                    label: '󰒭',
                })
            }),
        ],
    }),
    setup: (self) => self.hook(Mpris, (self) => {
        // const player = Mpris.getPlayer();
        if (!player)
            self.revealChild = false;
        else
            self.revealChild = true;
    }, 'notify::play-back-status'),
});

const CoverArt = ({ player, ...rest }) => {
    const fallbackCoverArt = Widget.Box({ // Fallback
        className: 'osd-music-cover-fallback',
        homogeneous: true,
        children: [Widget.Label({
            className: 'icon-material txt-gigantic txt-thin',
            label: 'music_note',
        })]
    });
    const realCoverArt = Widget.Box({
        className: 'osd-music-cover-art',
        homogeneous: true,
        attribute: {
            'pixbuf': null,
            'updateCover': (self) => {
                if (!player || player.trackTitle == "" || !player.coverPath) {
                    self.css = `background-image: none;`; // CSS image
                    return;
                }

                const coverPath = player.coverPath;
                if (player.coverPath == lastCoverPath) { // Since 'notify::cover-path' emits on cover download complete
                    Utils.timeout(200, () => {
                        // self.attribute.showImage(self, coverPath);
                        self.css = `background-image: url('${coverPath}');`; // CSS image
                    });
                }
                lastCoverPath = player.coverPath;
            },
        },
        setup: (self) => self
            .hook(player, (self) => {
                self.attribute.updateCover(self);
            }, 'notify::cover-path')
        ,
    });
    return Widget.Box({
        ...rest,
        className: 'osd-music-cover',
        children: [
            Widget.Overlay({
                child: fallbackCoverArt,
                overlays: [realCoverArt],
            })
        ],
    })
}
const TrackTitle = ({ player, ...rest }) => Widget.Label({
    ...rest,
    label: 'No music playing',
    xalign: 0,
    truncate: 'end',
    // wrap: true,
    className: 'osd-music-title',
    setup: (self) => self.hook(player, (self) => {
        // Player name
        self.label = player.trackTitle.length > 0 ? trimTrackTitle(player.trackTitle) : 'No media';
        // Font based on track/artist
    }, 'notify::track-title'),
});

const TrackArtists = ({ player, ...rest }) => Widget.Label({
    ...rest,
    xalign: 0,
    className: 'osd-music-artists',
    truncate: 'end',
    setup: (self) => self.hook(player, (self) => {
        self.label = player.trackArtists.length > 0 ? player.trackArtists.join(', ') : '';
    }, 'notify::track-artists'),
})

const MusicControlsWidget = (player) => Widget.Box({
    className: 'osd-music spacing-h-20 test',
    children: [
        CoverArt({ player: player, vpack: 'center' }),
        Widget.Box({
            vertical: true,
            className: 'spacing-v-5 osd-music-info',
            children: [
                Widget.Box({
                    vertical: true,
                    vpack: 'center',
                    hexpand: true,
                    children: [
                        TrackTitle({ player: player }),
                        TrackArtists({ player: player }),
                    ]
                }),
                Widget.Box({
                    className: 'osd-music-controlbtns-box',
                    setup: (box) => {
                        box.pack_start(TrackControls({ player: player }), false, false, 0);
                        box.pack_end(TrackTime({player: player}), false, false, 0)
                        // box.pack_end(TrackSource({ vpack: 'center', player: player }), false, false, 0);
                    }
                })
            ]
        })
    ]
})

export const MusicControls = (monitor = 0) => Widget.Revealer({
    transition: 'slide_down',
    transitionDuration: 0.3,
    revealChild: false,
    child: Widget.Box({
        children: Mpris.bind("players")
            .as(players => players.map((player) => (MusicControlsWidget(player))))
    }),
    setup: (self) => self.hook(showMusicControls, (revealer) => {
        revealer.revealChild = showMusicControls.value;
        const player = Mpris.getPlayer('');
        self.child = MusicControlsWidget(player);
    }),
})
export const MusicWindow = (monitor = 0) => {
    Widget.Window({
        name: `indicator-${monitor}`,
        className: 'indicator',
        layer: 'overlay',
        monitor,
        // exclusivity: 'ignore',
        visible: true,
        anchor: ['top'],
        child: Widget.EventBox({
            // onHover: () => { //make the widget hide when hovering
            //     showMusicControls.setValue(false);
            // },
            child: Widget.Box({
                vertical: true,
                className: 'osd-window',
                children: [
                    MusicControls(),
                ]
            })
        }),
    });
}