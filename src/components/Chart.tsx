import React, { useEffect, useRef, useState } from "react";
import {
    createChart,
    IChartApi,
    ISeriesApi,
    UTCTimestamp,
    CrosshairMode,
    LineStyle,
    ChartOptions,
    DeepPartial,
    AreaSeriesOptions,
} from "lightweight-charts";
import { io, Socket } from "socket.io-client";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { areaSeriesConfig } from "../config/chart";
import { chartConfig } from "../config/chart";
import { useChart } from "../hooks/useChart";
interface ChartProps {
    socketUrl: string;
}

interface PriceData {
    symbol: string;
    price: number;
    timestamp: string;
}

interface HistoricalData {
    change: number;
    change_percent: number;
    market_cap: number;
    price: number;
    time: number;
    trading_date: string;
    volume: number;
}

type TimeframeOption = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface ChartDataPoint {
    time: UTCTimestamp;
    value: number;
}

const Chart: React.FC<ChartProps> = ({ socketUrl }) => {
    const btcChartContainerRef = useRef<HTMLDivElement>(null);
    const ethChartContainerRef = useRef<HTMLDivElement>(null);
    const btcChartRef = useRef<IChartApi | null>(null);
    const ethChartRef = useRef<IChartApi | null>(null);
    const btcSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    const ethSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { fetchHistoricalData, isLoading } = useHistoricalData(socketUrl);

    const { initializeChart, updateChartData } = useChart({
        container: btcChartContainerRef.current,
        title: "Bitcoin",
        color: "#F7931A",
    });

    useEffect(() => {
        let isSubscribed = true;
        const setupCharts = async () => {
            try {
                if (
                    !btcChartContainerRef.current ||
                    !ethChartContainerRef.current
                ) {
                    throw new Error("Chart containers not found");
                }

                // Initialize Bitcoin chart
                const { chart: btcChart, series: btcSeries } = initializeChart(
                    btcChartContainerRef.current,
                    "Bitcoin",
                    "#F7931A"
                );
                if (isSubscribed) {
                    btcChartRef.current = btcChart;
                    btcSeriesRef.current = btcSeries;
                }

                // Initialize Ethereum chart
                const { chart: ethChart, series: ethSeries } = initializeChart(
                    ethChartContainerRef.current,
                    "Ethereum",
                    "#627EEA"
                );
                if (isSubscribed) {
                    ethChartRef.current = ethChart;
                    ethSeriesRef.current = ethSeries;
                }

                // Fetch historical data
                const [btcHistoricalData, ethHistoricalData] =
                    await Promise.all([
                        fetchHistoricalData("bitcoin"),
                        fetchHistoricalData("ethereum"),
                    ]);

                if (!isSubscribed) return;

                console.log("Historical data lengths:", {
                    bitcoin: btcHistoricalData.length,
                    ethereum: ethHistoricalData.length,
                });

                if (btcSeriesRef.current && btcHistoricalData.length > 0) {
                    btcSeriesRef.current.setData(btcHistoricalData);
                    btcChart.timeScale().fitContent();
                }

                if (ethSeriesRef.current && ethHistoricalData.length > 0) {
                    ethSeriesRef.current.setData(ethHistoricalData);
                    ethChart.timeScale().fitContent();
                }

                // Socket connection
                const socket = io(socketUrl, {
                    transports: ["websocket"],
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                if (!isSubscribed) {
                    socket.close();
                    return;
                }

                socketRef.current = socket;

                socket.on("connect", () => {
                    socket.emit("subscribe", ["bitcoin", "ethereum"]);
                });

                socket.on("connect_error", (err) => {
                    setError(`Socket connection error: ${err.message}`);
                });

                socket.on("price_update", (data: PriceData) => {
                    try {
                        console.log("Received real-time update:", data);
                        const timestamp = Math.floor(
                            new Date(data.timestamp).getTime() / 1000
                        ) as UTCTimestamp;
                        const chartData = {
                            time: timestamp,
                            value: data.price,
                        };

                        if (data.symbol === "bitcoin" && btcSeriesRef.current) {
                            updateChartData(btcSeriesRef.current, chartData);
                        } else if (
                            data.symbol === "ethereum" &&
                            ethSeriesRef.current
                        ) {
                            updateChartData(ethSeriesRef.current, chartData);
                        }
                    } catch (err) {
                        console.error("Error processing price update:", err);
                        setError(`Error processing price update: ${err}`);
                    }
                });
            } catch (err) {
                const errorMessage = `Error in setup: ${err}`;
                console.error(errorMessage);
                setError(errorMessage);
            }
        };

        setupCharts();

        return () => {
            isSubscribed = false;
            if (socketRef.current) {
                socketRef.current.emit("unsubscribe", ["bitcoin", "ethereum"]);
                socketRef.current.disconnect();
            }
            if (btcChartRef.current) btcChartRef.current.remove();
            if (ethChartRef.current) ethChartRef.current.remove();
        };
    }, [socketUrl]);

    if (error) {
        return (
            <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="charts-container">
            <div className="chart-wrapper">
                <h2>Bitcoin Price Chart</h2>
                <div ref={btcChartContainerRef} className="chart-div" />
            </div>
            <div className="chart-wrapper">
                <h2>Ethereum Price Chart</h2>
                <div ref={ethChartContainerRef} className="chart-div" />
            </div>
        </div>
    );
};

export default Chart;
