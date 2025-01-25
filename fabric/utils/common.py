from typing import Any

from gi.repository import GLib

from config import base_config


def create_module(name: str, _cls: Any, index: int, globals: dict[str, Any]) -> Any:
    globals[name] = _cls(monitor=index)
    return globals[name]


def execute(cmd: str) -> None:
    GLib.spawn_command_line_async(cmd)


def send_signal(dest: str) -> None:
    execute(f"python -m fabric execute {base_config.PROC_NAME} '{dest}'")
