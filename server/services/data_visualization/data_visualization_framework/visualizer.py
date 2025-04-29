from data_source import DataSource
from visualization_strategy import VisualizationStrategy

class DataVisualizer:
    def visualize(self, data_source: DataSource, strategy: VisualizationStrategy, independents = None, dependents = None, agg_func = None, output_file = None):
        df = data_source.get_data()
        strategy.plot(df, independents, dependents, agg_func, output_file)