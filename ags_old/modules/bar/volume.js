const audio = await Service.import("audio")

export const Volume = () => {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    }

    function getIcon() {
        const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
            threshold => threshold <= audio.speaker.volume * 100)

        return `audio-volume-${icons[icon]}-symbolic`
    }

    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    })

    const slider = Widget.Slider({
        hexpand: true,
        draw_value: false,
        on_change: ({ value }) => audio.speaker.volume = value,
        setup: self => self.hook(audio.speaker, () => {
            self.value = audio.speaker.volume || 0
        }),
    })

    return Widget.Box({
        class_name: "volume",
        tooltip_text: audio.speaker.bind("volume")
        .as((v) => v.toFixed(2).toString()),
        child: Widget.Button({
            child: icon,
            on_scroll_up: () => audio.speaker.volume += 0.05,
            on_scroll_down: () => audio.speaker.volume -= 0.05,
            onPrimaryClick: () => Utils.execAsync('pavucontrol &'),
        }),
        
    })
}