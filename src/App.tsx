import React from "react";
import "./App.css";
import Chart from "./components/Chart";

function App() {
    return (
        <div className="App">
            <Chart socketUrl="https://besttrade-be-sing-868447533878.asia-southeast1.run.app/" />
            <style>{`
                .App {
                    min-height: 100vh;
                    background: #F8F9FA;
                    padding: 24px 0;
                }
                     .charts-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding: 24px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    background: transparent;
                }
                .chart-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    width: 100%;
                    position: relative;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .chart-div {
                    width: 100%;
                    height: 400px;
                    position: relative;
                }
                .chart-legend {
                    background: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    margin: 0 0 16px 0;
                    color: #1A1D1F;
                    font-size: 20px;
                    font-weight: 600;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                .error-container {
                    padding: 16px;
                    background: #FEF2F2;
                    border: 1px solid #FEE2E2;
                    border-radius: 8px;
                    margin: 16px;
                }
                .error-container h3 {
                    color: #DC2626;
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                .error-container p {
                    color: #991B1B;
                    margin: 0;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
}

export default App;
