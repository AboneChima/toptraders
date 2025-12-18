'use client';

import { useEffect, useRef, useState } from 'react';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(89446.0);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize candles in a separate effect to avoid setState in effect warning
    const initialCandles = generateCandles(50, 89500);
    
    // Use setTimeout to defer state updates
    const initTimer = setTimeout(() => {
      setCandles(initialCandles);
      setCurrentPrice(initialCandles[initialCandles.length - 1].close);
    }, 0);

    const interval = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 30; // Reduced from 50
        const newClose = lastCandle.close + change;
        const newHigh = Math.max(lastCandle.high, newClose);
        const newLow = Math.min(lastCandle.low, newClose);
        
        const updatedCandles = [...prev];
        updatedCandles[updatedCandles.length - 1] = {
          ...lastCandle,
          close: newClose,
          high: newHigh,
          low: newLow,
        };
        
        setCurrentPrice(newClose);
        return updatedCandles;
      });
    }, 2000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    drawChart(ctx, candles, rect.width, rect.height, currentPrice, offset);
  }, [candles, currentPrice, offset]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    setOffset(prev => {
      const newOffset = prev + deltaX * 0.5;
      return Math.max(-300, Math.min(300, newOffset));
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    setOffset(prev => {
      const newOffset = prev + deltaX * 0.5;
      return Math.max(-300, Math.min(300, newOffset));
    });
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-black" 
      style={{ height: '320px' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}

function generateCandles(count: number, startPrice: number): Candle[] {
  const candles: Candle[] = [];
  let price = startPrice;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * 100; // Reduced from 150
    const close = open + change;
    const volatility = Math.random() * 30; // Reduced from 80 - smaller wicks
    const high = Math.max(open, close) + volatility;
    const low = Math.min(open, close) - volatility;
    
    candles.push({
      time: now - (count - i) * 60000,
      open,
      high,
      low,
      close,
    });
    
    price = close;
  }
  
  return candles;
}

function drawChart(
  ctx: CanvasRenderingContext2D,
  candles: Candle[],
  width: number,
  height: number,
  currentPrice: number,
  offset: number
) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  const padding = { top: 15, right: 75, bottom: 25, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const visibleCount = Math.min(30, candles.length);
  const startIdx = Math.max(0, Math.min(candles.length - visibleCount, Math.floor(offset / 10)));
  const visibleCandles = candles.slice(startIdx, startIdx + visibleCount);
  
  const prices = visibleCandles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const priceBuffer = priceRange * 0.05; // Reduced from 0.1 - tighter range
  
  const adjustedMin = minPrice - priceBuffer;
  const adjustedMax = maxPrice + priceBuffer;
  const adjustedRange = adjustedMax - adjustedMin;
  
  // Grid lines
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 1;
  ctx.font = '11px -apple-system, sans-serif';
  
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartHeight / gridLines) * i;
    const price = adjustedMax - (adjustedRange / gridLines) * i;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    // Price labels - more visible
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.fillText(price.toFixed(2), width - padding.right + 8, y + 4);
  }
  
  // Current price line
  const currentY = padding.top + ((adjustedMax - currentPrice) / adjustedRange) * chartHeight;
  
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding.left, currentY);
  ctx.lineTo(width - padding.right, currentY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Price label - more visible
  ctx.fillStyle = '#10b981';
  const labelText = currentPrice.toFixed(4);
  const labelWidth = 68;
  const labelHeight = 20;
  const labelX = width - padding.right + 5;
  const labelY = currentY - labelHeight / 2;
  
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 4);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, labelX + labelWidth / 2, labelY + 14);
  
  // Candlesticks
  const candleWidth = chartWidth / visibleCandles.length;
  const bodyWidth = Math.max(2, candleWidth * 0.7);
  
  visibleCandles.forEach((candle, i) => {
    const x = padding.left + i * candleWidth + candleWidth / 2;
    const openY = padding.top + ((adjustedMax - candle.open) / adjustedRange) * chartHeight;
    const closeY = padding.top + ((adjustedMax - candle.close) / adjustedRange) * chartHeight;
    const highY = padding.top + ((adjustedMax - candle.high) / adjustedRange) * chartHeight;
    const lowY = padding.top + ((adjustedMax - candle.low) / adjustedRange) * chartHeight;
    
    const isGreen = candle.close >= candle.open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    // Draw wick - thinner
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();
    
    // Draw body
    ctx.fillStyle = color;
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
  });
  
  // Time labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  
  const timeLabels = 4;
  for (let i = 0; i < timeLabels; i++) {
    const idx = Math.floor((visibleCandles.length / (timeLabels - 1)) * i);
    if (idx >= visibleCandles.length) continue;
    
    const candle = visibleCandles[idx];
    const x = padding.left + idx * candleWidth + candleWidth / 2;
    const time = new Date(candle.time);
    const timeStr = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    ctx.fillText(timeStr, x, height - 8);
  }
}
