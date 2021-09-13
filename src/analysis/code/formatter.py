import sys
import logging

from termcolor import colored

class ColorfulFormatter(logging.Formatter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def formatMessage(self, record):
        log = super().formatMessage(record)
        if record.levelno == logging.WARNING:
            prefix = colored("WARNING", "red", attrs=["blink"])
        elif record.levelno == logging.ERROR or record.levelno == logging.CRITICAL:
            prefix = colored("ERROR", "red", attrs=["blink", "underline"])
        else:
            return log
        return prefix + " " + log

def setup_very_basic_config(color=True):
    plain_formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s : %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    ch = logging.StreamHandler(stream=sys.stdout)
    ch.setLevel(logging.INFO)
    if color:
        formatter = ColorfulFormatter(
            colored("%(asctime)s | %(name)s: ", "green") + "%(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S",
        )
    else:
        formatter = plain_formatter
    ch.setFormatter(formatter)
    # Setup a minimal configuration for logging in case something tries to
    # log a message even before logging is setup by MMF.
    logging.basicConfig(level=logging.INFO, handlers=[ch])