import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const StockChart = ({ stock, chartData }) => {
  if (!stock || !chartData || chartData.length === 0) {
    return (
      <div className="chart-section">
        <div className="chart-content">종목을 선택하면 차트가 표시됩니다.<br />차트는 2일차부터 표시됩니다.</div>
      </div>
    );
  }

  // 데이터 형식 변환 (day가 문자열인 경우 정수로 변환)
  const formattedData = chartData
    .map((data) => ({
      day: typeof data.day === "string" ? parseInt(data.day.replace(/[^0-9]/g, "")) : data.day,
      dayLabel: `${data.day}일차`,
      price: data.price,
      changeRate: data.priceChangeRate,
    }))
    .sort((a, b) => a.day - b.day);

  // 최고가, 최저가 계산
  const prices = formattedData.map((d) => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Y축 범위 계산 - 여유 공간 확보
  const priceDiff = maxPrice - minPrice;
  const buffer = Math.max(priceDiff * 0.15, 1000); // 최소 1000원의 여백

  const yAxisMin = Math.max(0, Math.floor((minPrice - buffer) / 100) * 100);
  const yAxisMax = Math.ceil((maxPrice + buffer) / 100) * 100;

  // 레퍼런스 라인을 위한 시작 가격
  const startPrice = formattedData[0]?.price || 0;

  // 4-5개의 눈금 생성 (값 범위에 따라 적절하게 조정)
  const getOptimalTicks = (min, max) => {
    const range = max - min;

    // 적절한 간격 결정
    let interval;
    if (range <= 5000) interval = 1000;
    else if (range <= 10000) interval = 2000;
    else if (range <= 50000) interval = 10000;
    else if (range <= 100000) interval = 20000;
    else if (range <= 500000) interval = 100000;
    else interval = 200000;

    const firstTick = Math.ceil(min / interval) * interval;
    const ticks = [];

    for (let tick = firstTick; tick <= max; tick += interval) {
      ticks.push(tick);
    }

    // 최대값이 포함되어 있지 않으면 추가
    if (ticks[ticks.length - 1] < max) {
      ticks.push(ticks[ticks.length - 1] + interval);
    }

    return ticks;
  };

  const ticks = getOptimalTicks(yAxisMin, yAxisMax);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <div className="chart-title">{stock.stockName || stock.name} 주가 차트</div>
        <div className="price-summary">
          <span className="price-high">최고가: {maxPrice.toLocaleString()}원</span>
          <span className="price-divider">|</span>
          <span className="price-low">최저가: {minPrice.toLocaleString()}원</span>
        </div>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={320} debounce={50}>
          <LineChart data={formattedData} margin={{ left: 5, right: 30, top: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayLabel" padding={{ left: 10, right: 10 }} tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis domain={[yAxisMin, yAxisMax]} ticks={ticks} tickFormatter={(value) => value.toLocaleString()} width={80} tick={{ fontSize: 12 }} padding={{ top: 10, bottom: 10 }} />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}원`}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
            {/* 시작 가격 기준선 */}
            <ReferenceLine
              y={startPrice}
              stroke="#666"
              strokeDasharray="3 3"
              label={{
                value: "시작가",
                position: "right",
                fill: "#666",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              name="주가"
              dot={{ r: 1 }}
              activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2, fill: "#fff" }}
              connectNulls={true}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
