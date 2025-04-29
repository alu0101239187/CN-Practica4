import matplotlib
matplotlib.use('TkAgg')  # O 'Qt5Agg', 'Agg', dependiendo de tu entorno
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from visualization_strategy import VisualizationStrategy

class LineChart(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: str, dependents: list, agg_func: str = "mean", output_file=None):
        plt.figure(figsize=(10, 6))

        if isinstance(independents, list) and len(independents) > 1:
            raise ValueError("Barplot solo admite una columna como eje X.")
        independents = independents[0] if isinstance(independents, list) else independents

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(dependents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(dependents))

        for i, dependent in enumerate(dependents):
            agg_df = df.groupby(independents)[dependent].agg(agg_func).reset_index()
            sns.lineplot(
                x=agg_df[independents],
                y=agg_df[dependent],
                label=dependent,
                color=palette[i % len(palette)]
            )

        plt.title(f"Gráfico de Líneas ({agg_func})")
        plt.xlabel(independents)
        plt.ylabel("Valor")
        plt.legend()
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class BarChart(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: str, dependents: list, agg_func: str = "mean", output_file=None):
        if isinstance(independents, list) and len(independents) > 1:
            raise ValueError("Barplot solo admite una columna como eje X.")
        independents = independents[0] if isinstance(independents, list) else independents

        agg_df = df.groupby(independents)[dependents].agg(agg_func).reset_index()
        melted_df = agg_df.melt(id_vars=independents, value_vars=dependents, var_name="Variable", value_name="Valor")

        plt.figure(figsize=(10, 6))

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(dependents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(dependents))

        sns.barplot(x=independents, y="Valor", hue="Variable", data=melted_df, palette=palette)
        plt.title(f"Gráfico de Barras ({agg_func})")
        plt.xlabel(independents)
        plt.ylabel("Valor")
        plt.xticks(rotation=45)
        plt.legend(title="Variable")
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class ScatterPlot(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: str, dependents: list, agg_func = None, output_file=None):
        plt.figure(figsize=(10, 6))

        if isinstance(independents, list) and len(independents) > 1:
            raise ValueError("Barplot solo admite una columna como eje X.")
        independents = independents[0] if isinstance(independents, list) else independents

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(dependents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(dependents))

        for i, dependent in enumerate(dependents):
            sns.scatterplot(data=df, x=independents, y=dependent, label=dependent,
                color=palette[i % len(palette)], edgecolor="none")
        plt.title("Diagrama de Dispersión")
        plt.xlabel(independents)
        plt.ylabel("Valores")
        plt.legend()
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class Histogram(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: list, dependents = None, agg_func = None, output_file=None):
        fig, (ax_hist, ax_rug) = plt.subplots(
            2, 1, figsize=(10, 7), gridspec_kw={"height_ratios": [6, 1]}
        )

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(independents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(independents))

        if isinstance(independents, str):
            independents = [independents]
        for i, independent in enumerate(independents):
            data = df[independent].dropna()
            sns.histplot(data, kde=True, label=independent, bins=30, element="step", ax=ax_hist,
                color=palette[i % len(palette)])
            sns.rugplot(data, ax=ax_rug, height=1, lw=1, label=independent,
                color=palette[i % len(palette)])

        ax_hist.set_title("Histograma")
        ax_hist.set_ylabel("Frecuencia")
        ax_hist.legend()

        ax_rug.set_yticks([])
        ax_rug.set_xlabel("Valor")

        plt.subplots_adjust(hspace=0)
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class Correlogram(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: list, dependents=None, agg_func=None, output_file=None):
        df = df[independents]
        plt.figure(figsize=(10, 8))
        corr = df.corr()
        sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
        plt.title("Correlograma (Matriz de Correlación)")
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class BoxPlot(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: list, dependents = None, agg_func=None, output_file=None):
        if isinstance(independents, str):
            independents = [independents]
        melted_df = df[independents].melt(var_name="Variable", value_name="Valor")

        plt.figure(figsize=(10, 6))

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(independents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(independents))

        sns.boxplot(x="Variable", y="Valor", data=melted_df, hue="Variable", palette=palette, legend=False)
        plt.title("Diagrama de Caja (Distribución por Variable)")
        plt.xlabel("Variable")
        plt.ylabel("Valor")
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class DensityPlot(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: list, dependents=None, agg_func=None, output_file=None):
        plt.figure(figsize=(10, 6))

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(independents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(independents))

        if isinstance(independents, str):
            independents = [independents]
        for i, independent in enumerate(independents):
            sns.kdeplot(df[independent].dropna(), fill=True, label=independent,
                        color=palette[i % len(palette)], linewidth=2)

        plt.title("Curvas de Densidad")
        plt.xlabel("Valor")
        plt.ylabel("Densidad")
        plt.legend()
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()

class ViolinPlot(VisualizationStrategy):
    def plot(self, df: pd.DataFrame, independents: list, dependents=None, agg_func=None, output_file=None):
        if isinstance(independents, str):
            independents = [independents]
        melted_df = df[independents].melt(var_name="Variable", value_name="Valor")

        plt.figure(figsize=(10, 6))

        if isinstance(self.colors, str):
            palette = sns.color_palette(self.colors, n_colors=len(independents))
        elif isinstance(self.colors, list):
            palette = self.colors
        else:
            palette = sns.color_palette(n_colors=len(independents))

        sns.violinplot(x="Variable", y="Valor", hue="Variable", data=melted_df, palette=palette, inner="quartile")

        # Remover leyenda si existe, solo si está presente
        if plt.gca().get_legend() is not None:
            plt.legend().remove()

        plt.title("Diagrama de Violín (Distribución por Variable)")
        plt.xlabel("Variable")
        plt.ylabel("Valor")
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file)
        else:
            plt.show()