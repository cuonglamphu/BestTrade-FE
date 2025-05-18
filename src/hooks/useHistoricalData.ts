import { useState, useCallback } from "react";
import { UTCTimestamp } from "lightweight-charts";
import { ChartDataPoint } from "./useChart";

interface HistoricalData {
    change: number;
    change_percent: number;
    market_cap: number;
    price: number;
    time: number;
    trading_date: string;
    volume: number;
}

export const useHistoricalData = (baseUrl: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistoricalData = async (symbol: string) => {
        setIsLoading(true);
        try {
            console.log(`Fetching historical data for ${symbol}...`);
            const response = await fetch(
                `${baseUrl}/api/klines?symbol=${symbol}&interval=1s&limit=300`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error(`Invalid data format for ${symbol}`);
            }

            // Chuyển đổi và sắp xếp dữ liệu theo thời gian
            const chartData = data.data
                .map((item: HistoricalData) => {
                    try {
                        const timestamp = Math.floor(
                            new Date(item.time).getTime() / 1000
                        ) as UTCTimestamp;
                        return {
                            time: timestamp,
                            value: item.price,
                        };
                    } catch (err) {
                        console.error("Error processing item:", item, err);
                        return null;
                    }
                })
                .filter((item: ChartDataPoint | null) => item !== null)
                .sort(
                    (a: ChartDataPoint, b: ChartDataPoint) => a.time - b.time
                );

            return chartData;
        } catch (error) {
            const errorMessage = `Error fetching ${symbol} historical data: ${error}`;
            console.error(errorMessage);
            setError(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fetchHistoricalData,
        isLoading,
        error,
    };
};
