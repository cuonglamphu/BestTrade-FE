import { useRef, useEffect } from "react";
import {
    IChartApi,
    ISeriesApi,
    createChart,
    UTCTimestamp,
} from "lightweight-charts";
import { areaSeriesConfig } from "../config/chart";
import { chartConfig } from "../config/chart";

export interface ChartDataPoint {
    time: UTCTimestamp;
    value: number;
}

interface ChartConfig {
    container: HTMLDivElement | null;
    title: string;
    color: string;
}

export const useChart = ({ container, title, color }: ChartConfig) => {
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

    const initializeChart = (
        container: HTMLDivElement,
        title: string,
        color: string
    ) => {
        try {
            const chart = createChart(container, {
                ...chartConfig,
                width: container.clientWidth || 800,
                height: 400,
                handleScroll: true,
                handleScale: true,
            });

            const series = chart.addAreaSeries({
                ...areaSeriesConfig,
                lineColor: color,
                topColor:
                    color === "#F7931A"
                        ? "rgba(247, 147, 26, 0.4)"
                        : "rgba(98, 126, 234, 0.4)",
                bottomColor:
                    color === "#F7931A"
                        ? "rgba(247, 147, 26, 0)"
                        : "rgba(98, 126, 234, 0)",
            });

            return { chart, series };
        } catch (err) {
            console.error(`Error initializing chart for ${title}:`, err);
            throw err;
        }
    };

    const updateChartData = (
        series: ISeriesApi<"Area">,
        data: ChartDataPoint
    ) => {
        try {
            series.update(data);
        } catch (err) {
            if (
                err instanceof Error &&
                err.message.includes("Cannot update oldest data")
            ) {
                return;
            }
            console.error("Error updating chart data:", err);
        }
    };

    const setData = (data: ChartDataPoint[]) => {
        if (!seriesRef.current || !chartRef.current) return;

        seriesRef.current.setData(data);
        chartRef.current.timeScale().fitContent();
    };

    useEffect(() => {
        if (!container) return;

        const result = initializeChart(container, title, color);
        if (!result) return;

        const { chart, series } = result;

        const handleResize = () => {
            chart.applyOptions({
                width: container.clientWidth || 800,
            });
        };

        window.addEventListener("resize", handleResize);

        chartRef.current = chart;
        seriesRef.current = series;

        return () => {
            window.removeEventListener("resize", handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [container, title, color]);

    return {
        initializeChart,
        updateChartData,
        setData,
    };
};
