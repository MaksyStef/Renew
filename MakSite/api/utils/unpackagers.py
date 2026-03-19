from abc import ABC, abstractmethod
from zipfile import ZipFile
from django.conf import settings
from pathlib import Path

from ..models import Media


MEDIA_ROOT: Path = settings.MEDIA_ROOT


class BaseUnpackager(ABC):
  media_object: Media = ...

  @abstractmethod
  def unpack(self, data):
      ...


class ZipUnpackager(BaseUnpackager):
  def __init__(self, media_object):
      self.media_object = media_object

  def unpack(self, data):
      with ZipFile(data) as zip_file:
          zip_file.extractall(MEDIA_ROOT / self.media_object.project.title)