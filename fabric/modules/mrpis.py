from typing import cast

from fabric.widgets.box import Box
from fabric.widgets.button import Button
from fabric.widgets.label import Label
from fabric.widgets.revealer import Revealer

from modules import icons
from services.mrpis import MprisPlayer, create_mpris_player_manager


class Mpris(Box):
    """A widget to control the MPRIS."""

    def __init__(self, **kwargs):
        # Initialize the EventBox with specific name and style
        super().__init__(name='mrpis', **kwargs)
        self.player = None

        self.label = Label(label='Nothing playing', style_classes='panel-text')
        self.icon = Label(name='player-icon', size=20, markup=icons.play)

        # Services
        self.mpris_manager = create_mpris_player_manager()

        self.revealer = Revealer(
            name='mpris-revealer',
            transition_type='slide-right',
            transition_duration=400,
            child=self.label,
            child_revealed=True,
        )

        self.cover = Box(style_classes='cover')
        self.button_play_pause = Button(
            name='player-button', on_clicked=lambda *_: self.play_pause(), child=self.icon, tooltip_text='Play / Pause'
        )
        self.button_next = Button(
            name='player-button',
            on_clicked=lambda *_: self.player_next(),
            child=Label(name='player-icon', markup=icons.next),
            tooltip_text='Next',
        )
        self.button_prev = Button(
            name='player-button',
            on_clicked=lambda *_: self.player_prev(),
            child=Label(name='player-icon', markup=icons.prev),
            tooltip_text='Prev',
        )
        self.control_buttons = Box(spacing=10, children=(self.button_prev, self.button_play_pause, self.button_next))
        self.box = Box(spacing=10)

        self.children = self.box
        self.mpris_manager.connect('player-appeared', self.create_player)

    def create_player(self, *_) -> None:
        for player in self.mpris_manager.players:
            self.player = MprisPlayer(player)
            self.player.connect('notify::metadata', self.get_current)
            self.player.connect('notify::playback-status', self.get_playback_status)

    def get_current(self, *_):
        bar_label = cast(str, self.player.title)
        truncated_info = bar_label[:30]

        art_url = self.player.metadata['mpris:artUrl']

        self.label.set_label(truncated_info)
        self.cover.set_style(self._get_cover_style(art_url))
        self.set_tooltip_text(bar_label)

    def get_playback_status(self, *_):
        # Get the current playback status and change the icon accordingly
        status = self.player.playback_status.lower()
        if status == 'playing':
            self.box.children = (self.cover, self.control_buttons, self.revealer)
            self.revealer.set_reveal_child(True)
            self.icon.set_markup(icons.pause)
        elif status == 'paused':
            self.box.children = (self.cover, self.control_buttons, self.revealer)
            self.revealer.set_reveal_child(True)
            self.icon.set_markup(icons.play)
        else:
            self.box.children = ()
            self.revealer.set_reveal_child(False)

    def play_pause(self, *_) -> None:
        # Toggle play/pause using playerctl
        if self.player is not None:
            self.player.play_pause()

    def player_next(self, *_) -> None:
        if self.player is not None:
            self.player.next()

    def player_prev(self, *_) -> None:
        if self.player is not None:
            self.player.previous()

    def _get_cover_style(self, url: str | None) -> str:
        if url == '' or url is None:
            url = 'https://ladydanville.wordpress.com/wp-content/uploads/2012/03/blankart.png?w=297&h=278'
        return "background-image: url('" + url + "');background-size: cover; min-width: 50px; min-height: 50px;"


def create_mpris_player() -> Mpris:
    return Mpris()
