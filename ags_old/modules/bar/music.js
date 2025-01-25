import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import { showMusicControls } from '../../init.js';
import { MusicControls } from './musiccontrols.js';

export function trimTrackTitle(title) {
    if (!title) return '';
    const cleanPatterns = [
        /【[^】]*】/,        // Touhou n weeb stuff
        " [FREE DOWNLOAD]", // F-777
    ];
    cleanPatterns.forEach((expr) => title = title.replace(expr, ''));
    return title;
}

export const Media = (monitor = 0) => {
    const player = Mpris.getPlayer('');
    const playingState = Widget.Box({ // Wrap a box cuz overlay can't have margins itself
        homogeneous: true,
        children: [Widget.Overlay({
            child: Widget.Box({
                vpack: 'center',
                className: 'bar-music-playstate',
                homogeneous: true,
                children: [Widget.Label({
                    vpack: 'center',
                    className: 'bar-music-playstate-txt',
                    justification: 'center',
                    setup: (self) => self.hook(Mpris, label => {
                        const mpris = Mpris.getPlayer('');
                        label.label = `${mpris !== null && mpris.playBackStatus == 'Playing' ? '' : '--'}`;
                    }),
                })],
                setup: (self) => self.hook(Mpris, label => {
                    const mpris = Mpris.getPlayer('');
                    if (!mpris) return;
                    label.toggleClassName('bar-music-playstate-playing', mpris !== null && mpris.playBackStatus == 'Playing');
                    label.toggleClassName('bar-music-playstate', mpris !== null || mpris.playBackStatus == 'Paused');
                }),
            })
        })]
    });

    const trackLabel = Widget.Label({
        className: 'track-label',
        hexpand: true,
        truncate: 'end',
        max_width_chars: 40,
        setup: (self) => self.hook(Mpris, label => {
            const mpris = Mpris.getPlayer('');
            if (mpris) {
                label.label = `${trimTrackTitle(mpris.trackTitle)} • ${mpris.trackArtists.join(', ')}`;
            } else {
                label.label = getString('No media');
            }
        }),
    });

    const musicStuff = Widget.Box({
        className: 'spacing-h-10',
        hexpand: true,
        children: [
            playingState,
            trackLabel,
        ]
    })


    return Widget.EventBox({
        child: musicStuff,
        onPrimaryClick: () => showMusicControls.setValue(!showMusicControls.value),
        onSecondaryClick: () => player.playPause(),
        onMiddleClick: () => player.previous(),
    })
}