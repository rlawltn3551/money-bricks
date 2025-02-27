// components/StockList.jsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StockList = ({ stocks, onSelectStock, selectedStock }) => {
  return (
    <div className="stock-list">
      {stocks.map((stock) => (
        <div key={stock.code} className={`stock-item ${selectedStock?.code === stock.code ? "selected" : ""}`} onClick={() => onSelectStock(stock)}>
          <div className="stock-name">{stock.name}</div>
          <div className={`stock-price ${stock.price > 0 ? "up" : "down"}`}>
            {stock.price?.toLocaleString()}
            {stock.price > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
          <div className="stock-industry">{stock.industry}</div>
        </div>
      ))}
    </div>
  );
};

export default StockList;
