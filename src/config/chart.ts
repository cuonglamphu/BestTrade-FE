import {
    AreaSeriesOptions,
    ChartOptions,
    CrosshairMode,
} from "lightweight-charts";

import { DeepPartial } from "lightweight-charts";

import { LineStyle } from "lightweight-charts";

const chartConfig: DeepPartial<ChartOptions> = {
    layout: {
        background: { color: "transparent" },
        textColor: "#333333",
    },
    grid: {
        vertLines: { visible: false },
        horzLines: { visible: true, color: "rgba(0, 0, 0, 0.06)" },
    },
    timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: (time: number) => {
            const date = new Date(time * 1000);
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        },
    },
    rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
            top: 0.1,
            bottom: 0.1,
        },
    },
    crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
            width: 1,
            color: "rgba(41, 98, 255, 0.3)",
            style: LineStyle.Solid,
        },
        horzLine: {
            visible: true,
            color: "rgba(41, 98, 255, 0.3)",
            width: 1,
            style: LineStyle.Solid,
        },
    },
};

const areaSeriesConfig: DeepPartial<AreaSeriesOptions> = {
    lineColor: "#2962FF",
    topColor: "rgba(41, 98, 255, 0.4)",
    bottomColor: "rgba(41, 98, 255, 0)",
    lineWidth: 2,
    priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
    },
    lastValueVisible: true,
    priceLineVisible: true,
    crosshairMarkerVisible: true,
    priceLineStyle: LineStyle.Dashed,
    priceLineColor: "rgba(41, 98, 255, 0.5)",
    priceLineWidth: 1,
};

export { chartConfig, areaSeriesConfig };
