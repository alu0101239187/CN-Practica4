import pandas as pd
from abc import ABC, abstractmethod

class DataSource(ABC):
    @abstractmethod
    def get_data(self) -> pd.DataFrame:
        pass

class CSVDataSource(DataSource):
    def __init__(self, file_path):
        self.file_path = file_path

    def get_data(self) -> pd.DataFrame:
        return pd.read_csv(self.file_path)