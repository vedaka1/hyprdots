#!/bin/bash
. ~/.config/hyprv.conf

init_ags() {
    ags quit
    ags run &
}

set_wallpaper() {
    swww img --transition-type none $WALLPAPER_PATH
}

set_wallpaper
# init_ags
