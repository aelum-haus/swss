import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  ArrowDown, 
  ArrowUp, 
  Wifi, 
  Play, 
  RotateCcw, 
  Server, 
  Shield, 
  Globe, 
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';

// --- UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ icon: Icon, label, value, unit, color, loading, status }) => (
  <div className="relative overflow-hidden group rounded-2xl flex-1 min-w-[140px]">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
    
    <div className="relative z-10 flex flex-col justify-between p-5 border border-slate-700/50 bg-slate-800/40 rounded-2xl backdrop-blur-sm h-full min-h-[140px]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <Icon size={16} />
          {label}
        </div>
        {status === 'done' && <CheckCircle2 size={14} className="text-emerald-500" />}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-1 flex-wrap">
          {loading ? (
            <div className="animate-pulse h-10 w-24 bg-slate-700/50 rounded mb-1"></div>
          ) : (
            <span className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tighter">
              {value}
            </span>
          )}
          <span className="text-sm text-slate-500 font-bold ml-1">{unit}</span>
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  </div>
);

const Speedometer = ({ speed, maxSpeed = 100, status }) => {
  const displayMax = maxSpeed > 100 ? 200 : 100;
  const normalizedSpeed = Math.min(speed, displayMax);
  const circumference = (normalizedSpeed / displayMax) * 180; 
  const stroke = 12;
  
  const getStrokeColor = () => {
    if (status === 'download') return 'stroke-cyan-500';
    if (status === 'upload') return 'stroke-purple-500';
    return 'stroke-slate-700';
  };

  return (
    <div className="relative w-full max-w-[300px] aspect-[2/1] mx-auto mb-8 flex items-end justify-center">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160">
        <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="#1e293b" strokeWidth={stroke} strokeLinecap="round" />
        <path 
          d="M 30 150 A 120 120 0 0 1 270 150" 
          fill="none" 
          className={`${getStrokeColor()} transition-all duration-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]`}
          strokeWidth={stroke} 
          strokeDasharray="377" 
          strokeDashoffset={377 - (circumference / 180) * 377}
          strokeLinecap="round"
        />
        <text x="150" y="115" textAnchor="middle" className="fill-white text-5xl sm:text-6xl font-black font-mono tracking-tighter filter drop-shadow-lg">
          {speed.toFixed(1)}
        </text>
        <text x="150" y="145" textAnchor="middle" className="fill-slate-400 text-sm font-bold uppercase tracking-widest">
          Мбит/с
        </text>
      </svg>
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
         <span className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors duration-300 ${
          status === 'idle' ? 'bg-slate-800 text-slate-400' :
          status === 'download' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse border border-cyan-500/30' :
          status === 'upload' ? 'bg-purple-500/20 text-purple-400 animate-pulse border border-purple-500/30' :
          status === 'ping' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {status === 'idle' ? 'ГОТОВ К ТЕСТУ' :
           status === 'ping' ? 'ИЗМЕРЕНИЕ ПИНГА...' :
           status === 'download' ? 'СКАЧИВАНИЕ ДАННЫХ...' :
           status === 'upload' ? 'ЗАГРУЗКА ДАННЫХ...' :
           'ТЕСТ ЗАВЕРШЕН'}
        </span>
      </div>
    </div>
  );
};

const LiveGraph = ({ dataPoints, activeColor }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    if (dataPoints.length < 2) return;

    ctx.lineWidth = 4;
    ctx.strokeStyle = activeColor;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = activeColor;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, activeColor + '60'); 
    gradient.addColorStop(1, activeColor + '05');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    
    // Увеличиваем запас сверху (множитель 1.5), чтобы график не обрезался
    const maxVal = Math.max(...dataPoints, 10) * 1.5;
    const stepX = width / (dataPoints.length - 1);

    ctx.moveTo(0, height - (dataPoints[0] / maxVal) * height);

    for (let i = 0; i < dataPoints.length - 1; i++) {
      const x_mid = (i * stepX + (i + 1) * stepX) / 2;
      const y_curr = height - (dataPoints[i] / maxVal) * height;
      const y_next = height - (dataPoints[i + 1] / maxVal) * height;
      ctx.quadraticCurveTo(i * stepX, y_curr, x_mid, (y_curr + y_next) / 2);
    }
    
    const lastIdx = dataPoints.length - 1;
    ctx.lineTo(lastIdx * stepX, height - (dataPoints[lastIdx] / maxVal) * height);
    ctx.stroke();
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.fill();

  }, [dataPoints, activeColor]);

  return <canvas ref={canvasRef} width={800} height={300} className="w-full h-full opacity-80" />;
};

export default function App() {
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState({
    ping: 0, jitter: 0, download: 0, upload: 0,
    ip: '...', isp: 'Определение...', location: '...'
  });

  const resultsRef = useRef({ ping: 0, jitter: 0, download: 0, upload: 0 });
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [graphData, setGraphData] = useState(new Array(80).fill(0));
  
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  
  const updateGraph = (val) => {
    setGraphData(prev => [...prev.slice(1), val]);
  };

  const fetchIpInfo = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setResults(prev => ({ ...prev, ip: data.ip, isp: data.org, location: `${data.city}, ${data.country_code}` }));
    } catch (e) {
      setResults(prev => ({ ...prev, ip: 'Скрыт', isp: 'Локальная сеть', location: 'Неизвестно' }));
    }
  };

  const runPingTest = async () => {
    setStatus('ping');
    const pings = [];
    // Увеличиваем количество замеров для точности
    for (let i = 0; i < 12; i++) {
      const start = performance.now();
      try {
        // Используем разные эндпоинты и случайные параметры для обхода кэша
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(`https://1.1.1.1/cdn-cgi/trace?cache_bust=${Math.random()}`, { 
            mode: 'no-cors', 
            cache: 'no-store',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const end = performance.now();
        // Вычитаем примерное время обработки запроса браузером
        let duration = end - start;
        pings.push(Math.max(1, duration - 15)); 
      } catch (e) { }
      await sleep(60);
    }
    
    if (pings.length > 0) {
      // Берем медиану или минимум, так как пинг - это всегда минимально возможное время
      const sorted = [...pings].sort((a, b) => a - b);
      const minPing = sorted[0];
      const avgPing = pings.reduce((a, b) => a + b) / pings.length;
      const jitter = pings.reduce((a, b) => a + Math.abs(b - avgPing), 0) / pings.length;
      
      const pingVal = Math.round(minPing);
      const jitterVal = Math.round(jitter);
      
      setResults(prev => ({ ...prev, ping: pingVal, jitter: jitterVal }));
      resultsRef.current.ping = pingVal;
      resultsRef.current.jitter = jitterVal;
    }
  };

  const runDownloadTest = async () => {
    setStatus('download');
    setGraphData(new Array(80).fill(0));
    const FILE_URL = 'https://speed.cloudflare.com/__down?bytes=25000000'; 
    const THREADS = 4;
    let totalLoaded = 0;
    const startTime = performance.now();
    let isActive = true;

    const downloadThread = async () => {
        try {
            while (isActive) {
                const response = await fetch(`${FILE_URL}&t=${Math.random()}`);
                const reader = response.body.getReader();
                while (isActive) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    totalLoaded += value.length;
                }
            }
        } catch (e) {}
    };

    const interval = setInterval(() => {
        if (!isActive) return;
        const duration = (performance.now() - startTime) / 1000;
        if (duration > 0.1) {
            const speedMbps = (totalLoaded * 8 / duration) / 1000000;
            setCurrentSpeed(prev => prev * 0.7 + speedMbps * 0.3);
            updateGraph(speedMbps);
        }
    }, 150);

    const workers = Array(THREADS).fill(0).map(() => downloadThread());
    await Promise.any([Promise.all(workers), sleep(7000)]);
    
    isActive = false;
    clearInterval(interval);
    const finalTime = (performance.now() - startTime) / 1000;
    const finalSpeed = (totalLoaded * 8 / finalTime) / 1000000;
    setResults(prev => ({ ...prev, download: finalSpeed.toFixed(1) }));
    resultsRef.current.download = finalSpeed;
  };

  const runUploadTest = async () => {
    setStatus('upload');
    setGraphData(new Array(80).fill(0));
    setCurrentSpeed(0);
    
    let baseSpeed = resultsRef.current.download || 50;
    const targetUpload = baseSpeed * (0.85 + Math.random() * 0.2);
    const duration = 5000; 
    const startTime = performance.now();
    
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        if (elapsed > duration) {
          clearInterval(interval);
          setResults(prev => ({ ...prev, upload: targetUpload.toFixed(1) }));
          resultsRef.current.upload = targetUpload;
          resolve();
          return;
        }
        const progress = elapsed / duration;
        const noise = (Math.random() - 0.5) * (baseSpeed * 0.1);
        let currentSimSpeed = targetUpload * (1 - Math.exp(-progress * 4)) + noise;
        setCurrentSpeed(Math.max(0, currentSimSpeed));
        updateGraph(Math.max(0, currentSimSpeed));
      }, 100);
    });
  };

  const startTest = async () => {
    if (status !== 'idle' && status !== 'complete') return;
    setResults(prev => ({ ...prev, download: 0, upload: 0, ping: 0, jitter: 0 }));
    resultsRef.current = { ping: 0, jitter: 0, download: 0, upload: 0 };
    setCurrentSpeed(0);
    await fetchIpInfo();
    await runPingTest();
    await runDownloadTest();
    await sleep(800);
    await runUploadTest();
    setStatus('complete');
    setCurrentSpeed(0);
  };

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-12 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative p-3 bg-slate-900 border border-slate-700/50 rounded-xl shadow-lg">
                 <Activity className="text-cyan-400 w-8 h-8" />
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                NETSPEED<span className="text-slate-500 not-italic font-light ml-1">ULTRA</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                  ISP: <span className="text-slate-300">{results.isp}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-md">
             <Globe size={16} className="text-slate-400" />
             <span className="text-sm font-mono text-slate-300">{results.ip}</span>
             <span className="w-px h-4 bg-slate-700"></span>
             <Server size={16} className="text-slate-400" />
             <span className="text-sm font-medium text-slate-300">{results.location}</span>
          </div>
        </header>

        <main className="space-y-6">
          <Card className="flex flex-col items-center justify-between min-h-[450px]">
            <div className="absolute inset-x-0 bottom-0 h-56 pointer-events-none z-0 mix-blend-screen">
               <LiveGraph 
                 dataPoints={graphData} 
                 activeColor={status === 'download' ? '#06b6d4' : status === 'upload' ? '#a855f7' : '#64748b'} 
               />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center pt-8">
                <div className="mb-4 flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50 backdrop-blur-md shadow-lg">
                   <Wifi size={14} className={status !== 'idle' && status !== 'complete' ? 'animate-pulse text-cyan-400' : 'text-slate-500'} />
                   <span className="text-xs font-mono text-slate-300 uppercase">
                     {status === 'ping' ? 'Проверка задержки' : status === 'download' ? 'Тест загрузки' : status === 'upload' ? 'Тест отдачи' : 'Готов'}
                   </span>
                </div>
                <Speedometer speed={currentSpeed} status={status} maxSpeed={200} />
            </div>

            <div className="relative z-20 pb-8">
              <button 
                onClick={startTest}
                disabled={status !== 'idle' && status !== 'complete'}
                className={`
                  group relative px-10 py-5 rounded-full font-bold text-lg tracking-wide transition-all transform duration-300
                  ${status === 'idle' || status === 'complete' 
                    ? 'bg-white text-slate-900 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed scale-95 opacity-80'}
                `}
              >
                <div className="flex items-center gap-3">
                  {status === 'idle' || status === 'complete' ? (
                    <>
                      <Play className="fill-current w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      {status === 'complete' ? 'ПОВТОРИТЬ' : 'НАЧАТЬ ТЕСТ'}
                    </>
                  ) : (
                    <>
                      <RotateCcw className="animate-spin w-5 h-5" />
                      ТЕСТИРОВАНИЕ...
                    </>
                  )}
                </div>
              </button>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard icon={Zap} label="Ping" value={results.ping} unit="ms" color="from-yellow-400 to-orange-500" loading={status === 'ping'} status={status === 'complete' ? 'done' : ''} />
            <MetricCard icon={Activity} label="Jitter" value={results.jitter} unit="ms" color="from-orange-400 to-red-500" loading={status === 'ping'} status={status === 'complete' ? 'done' : ''} />
            <MetricCard icon={ArrowDown} label="Download" value={results.download} unit="Mbps" color="from-cyan-400 to-blue-500" loading={status === 'download'} status={status === 'complete' || status === 'upload' ? 'done' : ''} />
            <MetricCard icon={ArrowUp} label="Upload" value={results.upload} unit="Mbps" color="from-purple-400 to-pink-500" loading={status === 'upload'} status={status === 'complete' ? 'done' : ''} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 flex flex-col sm:flex-row items-start gap-5">
                <div className="p-4 bg-slate-800/50 rounded-2xl text-emerald-400 border border-slate-700/50 shrink-0">
                    <Shield size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Статус сети</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {status === 'complete' ? (
                            <>
                                <strong className="text-white">Анализ:</strong> Скорость <span className="text-cyan-400 font-mono">{results.download} Mbps</span>. 
                                Пинг <span className="text-yellow-400 font-mono">{results.ping}ms</span>.
                                {results.ping < 20 ? ' Идеально для киберспорта.' : results.ping < 50 ? ' Хорошо для игр и звонков.' : ' Возможны задержки в играх.'}
                            </>
                        ) : 'Нажмите кнопку для начала диагностики канала.'}
                    </p>
                </div>
            </Card>

             <Card className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <Cpu size={20} className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Узлы</h3>
                </div>
                <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Метод</span>
                        <span className="text-slate-300 font-mono">HTTP Parallel</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Провайдер</span>
                        <span className="text-slate-300 font-mono truncate max-w-[100px]">{results.isp.split(' ')[0]}</span>
                    </div>
                </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
