from functools import lru_cache

from fabric.audio import Audio
from fabric.widgets.box import Box
from fabric.widgets.eventbox import EventBox
from fabric.widgets.label import Label

from modules import icons


@lru_cache(1)
def create_audio() -> Audio:
    return Audio()


class AudioSwitcher(EventBox):
    def __init__(self, **kwargs) -> None:
        super().__init__(events=['scroll', 'smooth-scroll', 'enter-notify-event'], **kwargs)
        self.audio = create_audio()
        # self.progress_bar = CircularProgressBar(
        #     style_classes='overlay-progress-bar',
        #     pie=False,
        #     size=24,
        # )

        self.icon = Label(name='volume-icon', size=20, markup=icons.vol_medium)
        self.volume_label = Label(name='volume-label', visible=False, justification='left')
        self.volume_device_label = Label(name='volume-device-label', visible=False)

        volume_label_box = Box(children=(self.volume_label, Box(h_expand=True)))
        volume_text = Box(
            name='volume-text',
            orientation='v',
            h_align='start',
            v_align='center',
            children=[volume_label_box, self.volume_device_label],
        )
        self.box = Box(
            h_align='start',
            v_align='center',
            spacing=10,
            name='volume',
            style_classes='panel-box',
            children=(
                self.icon,
                # Overlay(child=self.progress_bar, overlays=self.icon, name='overlay'),
                volume_text,
            ),
        )
        self.audio.connect('notify::speaker', self.on_speaker_changed)
        # Connect the event box to handle scroll events
        self.connect('button-press-event', lambda *_: self.toggle_mute())
        self.connect('scroll-event', self.on_scroll)
        self.connect('child-notify', lambda *_: self.children[0].add_style_class('overlay-progress-bar'))

        # Add the event box as a child
        self.add(self.box)

    def on_scroll(self, _, event):
        # Adjust the volume based on the scroll direction

        val_y = event.delta_y

        if val_y > 0:
            self.audio.speaker.volume -= 1
        else:
            self.audio.speaker.volume += 1

    def on_speaker_changed(self, *_):
        # Update the progress bar value based on the speaker volume
        if not self.audio.speaker:
            return

        self.set_tooltip_text(self.audio.speaker.description)
        self.audio.speaker.connect('notify::volume', self.update_volume)

        device_ssid = f'{self.audio.speaker.description[:13]}...'
        self.volume_device_label.set_text(device_ssid)
        self.update_volume()

    # Mute and unmute the speaker
    def toggle_mute(self):
        current_stream = self.audio.speaker
        if current_stream:
            current_stream.muted = not current_stream.muted
            self.icon.set_markup(icons.vol_mute) if current_stream.muted else self.update_volume()

    def update_volume(self, *_):
        if self.audio.speaker:
            volume = round(self.audio.speaker.volume)
            icon = icons.vol_high

            # self.progress_bar.set_value(volume / 100)
            self.volume_label.set_text(f'{volume}%')

            if volume >= 60:
                icon = icons.vol_high
            elif volume > 0 and volume < 60:
                icon = icons.vol_medium
            elif volume == 0:
                icon = icons.vol_off

            self.icon.set_markup(icon)
