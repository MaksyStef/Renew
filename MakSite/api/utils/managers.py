from abc import ABC, abstractmethod
from zipfile import ZipFile
from django.conf import settings
from pathlib import Path

from ..models import Media


MEDIA_ROOT: Path = settings.MEDIA_ROOT


class BaseManager(ABC):
  media_object: Media = ...

  @abstractmethod
  def unpack(self, data):
      ...


class ZipManager(BaseManager):
    media_object: Media = ...
    unpacked_path: Path = MEDIA_ROOT / "unpacked" / str(media_object.pk)


    def __init__(self, media_object: Media):
      self.media_object = media_object


    def unpack(self):
        with ZipFile(self.media_object.zip_file.path) as zip_file:
            zip_file.extractall(self.unpacked_path)


    def cleanup(self):
        if not self.unpacked_path.exists():
            return
        for item in self.unpacked_path.iterdir():
            if item.is_file():
                item.unlink()
            elif item.is_dir():
                item.rmdir()