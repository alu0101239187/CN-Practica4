import argparse
from data_source import CSVDataSource
from charts import LineChart, BarChart, BoxPlot, Histogram, ScatterPlot,  Correlogram, DensityPlot, ViolinPlot
from visualizer import DataVisualizer

# Diccionario para mapear nombres de gráfico a clases
chart_map = {
    "line": LineChart,
    "bar": BarChart,
    "scatter": ScatterPlot,
    "histogram": Histogram,
    "correlogram": Correlogram,
    "box": BoxPlot,
    "density": DensityPlot,
    "violin": ViolinPlot,
}

# Argumentos desde terminal
parser = argparse.ArgumentParser(description="Visualizador de datos")
parser.add_argument("--chart", type=str, required=True, choices=chart_map.keys(), help="Tipo de gráfico a generar")
parser.add_argument("--file", type=str, required=True, help="Ruta del archivo CSV")
parser.add_argument("--x", type=str, nargs="+", default=None, help="Variable independiente")
parser.add_argument("--y", type=str, nargs="+", default=None, help="Variables dependientes")
parser.add_argument("--agg", type=str, default="mean", help="Función de agregación (si aplica)")
parser.add_argument("--colors", type=str, default="deep", help="Paleta de colores")
parser.add_argument("--out", help="Archivo de salida (ej: grafico.png)")

args = parser.parse_args()

# Cargar fuente de datos
source = CSVDataSource(args.file)
visualizer = DataVisualizer()

# Instanciar la clase del gráfico correspondiente
chart_class = chart_map[args.chart]
strategy = chart_class(colors=args.colors)

# Ejecutar visualización
visualizer.visualize(source, strategy, args.x, args.y, args.agg, args.out)