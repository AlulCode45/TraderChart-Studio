import React, { useState, useRef, useEffect } from 'react';
import {
  CandlestickChart,
  Layers,
  Grid,
  Sun,
  Moon,
  Plus,
  Download,
  Copy,
  CheckCircle2,
  Code2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { CustomChartConfig } from './types/chartBuilderTypes';
import { CustomChartRenderer } from './components/illustration/CustomChartRenderer';
import { CustomChartBuilderModal } from './components/chart-builder/CustomChartBuilderModal';
import { UnifiedIllustrationEngine } from './components/illustration/UnifiedIllustrationEngine';
import { PresetSvgCatalog } from './components/illustration/PresetSvgCatalog';
import { SAMPLE_CHART_PRESETS } from './data/sampleCharts';

type StudioTab = 'custom-builder' | 'unified-engine' | 'preset-catalog';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('custom-builder');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_CHART_PRESETS[0].id);
  const [chartConfig, setChartConfig] = useState<CustomChartConfig>(SAMPLE_CHART_PRESETS[0].config);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(SAMPLE_CHART_PRESETS[0].config, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const rendererContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ce-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ce-theme', 'light');
    }
  }, [isDarkMode]);

  const handleSelectPreset = (presetId: string) => {
    const found = SAMPLE_CHART_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setChartConfig(found.config);
    setJsonText(JSON.stringify(found.config, null, 2));
    setJsonError(null);
  };

  const handleBuilderSave = (newConfig: CustomChartConfig) => {
    setChartConfig(newConfig);
    setJsonText(JSON.stringify(newConfig, null, 2));
    setJsonError(null);
    setIsBuilderOpen(false);
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value) as CustomChartConfig;
      if (!parsed || !Array.isArray(parsed.candles)) {
        setJsonError('Config must include a "candles" array.');
        return;
      }
      setChartConfig(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON syntax');
    }
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(chartConfig, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgEl = rendererContainerRef.current?.querySelector('svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(chartConfig.title || 'trading-chart').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-ui bg-[#08090D] not-dark:bg-[#F8FAFC] text-[#F8FAFC] not-dark:text-[#0F172A]">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-30 border-b border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017]/90 not-dark:bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 not-dark:text-emerald-600">
              <CandlestickChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">ChartingEngine</h1>
                <span className="text-[10px] font-mono-data uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 not-dark:text-emerald-700 border border-emerald-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-[#929BAA] not-dark:text-slate-500 hidden sm:block">
                Trading Documentation & Technical Illustration Studio
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[#121722] not-dark:bg-slate-100 border border-[#1D2532] not-dark:border-slate-200">
            <button
              onClick={() => setActiveTab('custom-builder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'custom-builder'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              SVG Chart Studio
            </button>
            <button
              onClick={() => setActiveTab('unified-engine')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'unified-engine'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Unified Engine
            </button>
            <button
              onClick={() => setActiveTab('preset-catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'preset-catalog'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Preset Catalog
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode((d) => !d)}
              className="p-2 rounded-lg border border-[#1D2532] not-dark:border-slate-200 bg-[#121722] not-dark:bg-slate-50 text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Open Visual Builder</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'custom-builder' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017] not-dark:bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[#929BAA] not-dark:text-slate-500 mr-1">
                  Sample Presets:
                </span>
                {SAMPLE_CHART_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedPresetId === preset.id
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 not-dark:text-emerald-700'
                        : 'bg-[#121722] not-dark:bg-slate-50 border-[#1D2532] not-dark:border-slate-200 text-[#929BAA] not-dark:text-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowJsonPanel((s) => !s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    showJsonPanel
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 not-dark:text-sky-700'
                      : 'bg-[#121722] not-dark:bg-slate-50 border-[#1D2532] not-dark:border-slate-200 text-[#929BAA] not-dark:text-slate-600'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showJsonPanel ? 'Hide JSON' : 'Edit JSON'}</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1D2532] not-dark:border-slate-200 bg-[#121722] not-dark:bg-slate-50 text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900 transition-colors"
                >
                  {copiedJson ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#1D2532] not-dark:border-slate-200 bg-[#121722] not-dark:bg-slate-50 text-[#929BAA] not-dark:text-slate-600 hover:text-white not-dark:hover:text-slate-900 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export SVG</span>
                </button>
              </div>
            </div>

            {/* Renderer + Optional JSON Editor */}
            <div className={`grid gap-4 ${showJsonPanel ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
              <div
                ref={rendererContainerRef}
                className={`${showJsonPanel ? 'lg:col-span-7' : ''} rounded-xl border border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017] not-dark:bg-white p-3 sm:p-4`}
              >
                <CustomChartRenderer config={chartConfig} title={chartConfig.title} />
              </div>

              {showJsonPanel && (
                <div className="lg:col-span-5 flex flex-col rounded-xl border border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017] not-dark:bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#1D2532] not-dark:border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono-data font-semibold">CustomChartConfig (JSON)</span>
                    {jsonError ? (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {jsonError}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400">Valid Config</span>
                    )}
                  </div>
                  <textarea
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    spellCheck={false}
                    className="flex-1 min-h-[480px] p-4 bg-transparent font-mono-data text-xs leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'unified-engine' && (
          <div className="rounded-xl border border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017] not-dark:bg-white p-4">
            <UnifiedIllustrationEngine
              initialMode="interactive_chart"
              chartConfig={{
                title: 'Unified Trading Illustration Engine',
                symbol: 'BTC/USDT',
                timeframe: 'H1',
              }}
            />
          </div>
        )}

        {activeTab === 'preset-catalog' && (
          <div className="rounded-xl border border-[#1D2532] not-dark:border-slate-200 bg-[#0D1017] not-dark:bg-white p-4">
            <PresetSvgCatalog />
          </div>
        )}
      </main>

      {/* Interactive Visual Chart Builder Modal */}
      <CustomChartBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleBuilderSave}
        initialConfig={chartConfig}
      />
    </div>
  );
}
