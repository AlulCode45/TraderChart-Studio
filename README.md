# ChartingEngine

An open-source visual charting and technical illustration engine built with **React**, **TypeScript**, **Tailwind CSS**, **SVG**, and **TradingView Lightweight Charts v5**.

Designed specifically for creating clean, publication-grade **trading documentation**, **Smart Money Concepts (SMC) / ICT playbooks**, **price action guides**, and **quantitative strategy docs**.

---

## Features

### 1. Custom SVG Chart Builder & Renderer
- **Visual Studio (`CustomChartBuilderModal`, `ChartCanvas`, `CandleTemplateTray`)**: Interactive editor to place and customize candlesticks, market structure lines, zones, and annotations with live Dark/Light theme support.
- **Declarative JSON Renderer (`CustomChartRenderer`)**: Render crisp, zoomable, pan-ready SVG trading diagrams directly from a typed `CustomChartConfig` JSON object.
- **Rich Trading Primitives**:
  - **Candlesticks & Indicators**: OHLC candles with custom colors/labels, optional volume histogram, and EMA overlay.
  - **Zones (`BoxDrawing`)**: Order Blocks (`order_block`), Fair Value Gaps (`fvg`), Supply/Demand (`supply_demand`), and Liquidity Pools (`liquidity_pool`) with optional 50% Mean Threshold / Consequent Encroachment midlines.
  - **Fibonacci Retracements (`FibonacciDrawing`)**: Custom levels and shaded OTE (Optimal Trade Entry) Golden Pocket zones.
  - **Risk/Reward Positions (`PositionDrawing`)**: Long & Short entry/SL/TP boxes with automatic R:R ratio badges.
  - **Structure & Flow**: `TrendlineDrawing` (BOS / CHoCH with rays & arrows), `PolylineDrawing` (`zigzag` or `smooth` macro waves), and `ArrowDrawing` (straight or curved pointers).
  - **Educational Callouts**: `InfoCardDrawing` (multi-line phase cards with step badges) and `TextBadgeAnnotation` (`pill`, `badge`, `outline`, `callout`).
- **One-Click Export**: Copy `CustomChartConfig` JSON or export the rendered chart directly as an `.svg` file for Markdown, Notion, GitHub, or web docs.

### 2. Interactive Market Chart (`InteractiveTradingChart`)
- Powered by **TradingView `lightweight-charts` v5** (`CandlestickSeries`, `HistogramSeries`).
- Supports interactive crosshair, markers (`arrowUp`, `arrowDown`, `circle`, `square`), horizontal key price levels, and price box overlays.

### 3. Preset Technical Diagram Catalog (`PresetSvgCatalog` & `VisualDiagram`)
- Ready-to-use vector diagrams covering core trading concepts (Candlestick Anatomy, Market Structure, BOS/CHoCH, Strong/Weak Levels, Supply & Demand, Order Blocks, and more).

### 4. Chart Snapshot Viewer (`ChartSnapshotViewer`)
- Display and annotate external chart screenshots or TradingView snapshot URLs (`https://www.tradingview.com/x/...` auto-resolved to direct image URLs) with zoom and lightbox support.

### 5. Unified Illustration Engine (`UnifiedIllustrationEngine`)
- Drop-in component that unifies `preset`, `interactive_chart`, and `snapshot` modes behind a single mode-switching interface.

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation & Development

```bash
# Install dependencies
bun install

# Start the ChartingEngine Studio
bun run dev
```

Open `http://localhost:3000` in your browser to launch the **ChartingEngine Studio**.

### Production Build

```bash
bun run build
bun run preview
```

---

## Project Structure

```text
src/
├── App.tsx                                       # Standalone ChartingEngine Studio
├── types/
│   └── chartBuilderTypes.ts                      # CustomChartConfig & drawing primitive types
├── data/
│   └── sampleCharts.ts                           # Built-in SMC & FVG JSON presets
└── components/
    ├── VisualDiagram.tsx                         # Preset SVG trading diagram library
    ├── chart-builder/
    │   ├── CustomChartBuilderModal.tsx           # Interactive visual chart editor modal
    │   ├── ChartCanvas.tsx                       # Interactive SVG editing canvas
    │   └── CandleTemplateTray.tsx                # Candlestick & scenario template tray
    └── illustration/
        ├── CustomChartRenderer.tsx               # Declarative SVG chart renderer
        ├── InteractiveTradingChart.tsx           # Lightweight Charts v5 wrapper
        ├── ChartSnapshotViewer.tsx               # Snapshot viewer & annotator
        ├── PresetSvgCatalog.tsx                  # Searchable preset diagram catalog
        └── UnifiedIllustrationEngine.tsx         # Multi-mode illustration wrapper
```

---

## Declarative Usage (`CustomChartRenderer`)

You can embed any chart in your React documentation app by passing a `CustomChartConfig` object:

```tsx
import { CustomChartRenderer } from './components/illustration/CustomChartRenderer';
import type { CustomChartConfig } from './types/chartBuilderTypes';

const config: CustomChartConfig = {
  title: 'LIQUIDITY SWEEP & ORDER BLOCK ENTRY',
  subtitle: 'BTC/USDT H1 • Bullish Displacement & 50% Mean Threshold Retest',
  candleSpacing: 'wide',
  showCandles: true,
  showVolume: true,
  candles: [
    { id: 'c0', index: 0, open: 100, high: 104, low: 98, close: 103, volume: 1200, label: 'Consolidation' },
    { id: 'c1', index: 1, open: 103, high: 105, low: 93, close: 97, volume: 2800, label: 'Judas Sweep' },
    { id: 'c2', index: 2, open: 97, high: 110, low: 96, close: 108, volume: 3900, label: 'Displacement' },
    { id: 'c3', index: 3, open: 108, high: 116, low: 107, close: 115, volume: 3400, label: 'BOS High' },
    { id: 'c4', index: 4, open: 115, high: 116, low: 103, close: 105, volume: 1400, label: 'OB Retest' },
    { id: 'c5', index: 5, open: 105, high: 125, low: 104, close: 123, volume: 4200, label: 'Expansion TP' },
  ],
  boxes: [
    {
      id: 'ob-demand',
      boxType: 'order_block',
      startIndex: 1,
      endIndex: 4,
      topPrice: 103,
      bottomPrice: 94,
      label: 'Bullish Order Block (OB)',
      labelPosition: 'bottom-left',
      color: '#10B981',
      opacity: 0.18,
      showMidLine: true,
      midLineLabel: '50% MT',
    },
  ],
  trendlines: [
    {
      id: 'tl-bos',
      x1Index: 0,
      y1Price: 104,
      x2Index: 3,
      y2Price: 104,
      color: '#10B981',
      strokeWidth: 1.6,
      lineStyle: 'dashed',
      label: 'BOS Valid Body Close',
      labelAlignment: 'center',
      showArrow: true,
    },
  ],
};

export function ExampleDocChart() {
  return <CustomChartRenderer config={config} title={config.title} />;
}
```

---

## Layout & Anti-Clashing Guidelines

When authoring `CustomChartConfig` JSON manually or via AI agents, follow these rules to keep charts clean and readable:

1. **3-Tier Vertical Zoning**:
   - **Lower Tier** (3%–6% below lowest wick): Place SSL sweeps, demand labels, and long stop-loss badges.
   - **Middle Tier** (candle body range): Reserve strictly for candles, Order Block / FVG boxes, and BOS trendlines. Never place `infoCards` or `badges` inside candle bodies.
   - **Upper Tier** (4%–8% above highest wick): Place BSL sweeps, resistance labels, and take-profit badges.
2. **Spacious Horizontal Spacing**:
   - Use `candleSpacing: 'wide'` (92px step) or `'ultra-wide'` (120px step) whenever using `infoCards` or multi-word `badges`.
3. **InfoCard Anchoring**:
   - Place right-side `infoCards` at `candleIndex: lastIndex + 1` with `alignX: 'left'` so they extend into open whitespace rather than overlapping candles.
4. **Standard Semantic Palette**:

| Concept | Hex Color | Usage |
| :--- | :--- | :--- |
| Bullish / Demand / Order Block | `#10B981` | Demand zones, bullish displacement, long targets |
| Bearish / Supply / Liquidity Sweep | `#EF4444` / `#F43F5E` | Supply zones, stop loss, sweep callouts |
| Fair Value Gap (FVG) | `#38BDF8` | Price imbalance / inefficiency zones |
| Liquidity Pools (BSL / SSL) | `#FACC15` / `#F59E0B` | Equal highs/lows, retail stop clusters |
| Fibonacci OTE Zone | `#8B5CF6` | 61.8% – 78.6% retracement pocket |

---

## License

MIT License — see [LICENSE](./LICENSE) for details.
