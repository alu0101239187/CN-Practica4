from abc import ABC, abstractmethod
import pandas as pd

class VisualizationStrategy(ABC):
    def __init__(self, colors = None):
        self.colors = colors

    @abstractmethod
    def plot(self, df: pd.DataFrame, independents, dependents, agg_func, output_file):
        pass