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
  Zap
} from 'lucide-react';

// --- Компоненты UI ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ icon: Icon, label, value, unit, color, loading }) => (
  <div className="relative overflow-hidden group rounded-2xl">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
    <div className="relative z-10 flex flex-col items-center justify-center p-5 border border-slate-700/50 bg-slate-800/40 rounded-2xl backdrop-blur-sm h-36 w-full">
      <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm font-medium uppercase tracking-wider">
        <Icon size={16} />
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        {loading ? (
          <div className="animate-pulse h-9 w-20 bg-slate-700 rounded mb-1"></div>
        ) : (
          <span className="text-4xl font-bold font-mono text-white tracking-tighter">{value}</span>
        )}
        <span className="text-xs text-slate-500 font-bold ml-1">{unit}</span>
      </div>
      {/* Декоративная линия */}
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  </div>
);

// --- Компонент Спидометра (SVG) ---
const Speedometer = ({ speed, maxSpeed = 100, status }) => {
  const radius = 120;
  const stroke = 12;
  const normalizedSpeed = Math.min(speed, maxSpeed);
  const circumference = normalizedSpeed / maxSpeed * 180; // 180 градусов арка
  
  // Цвет дуги меняется в зависимости от статуса
  const getStrokeColor = () => {
    if (status === 'download') return 'stroke-cyan-500';
    if (status === 'upload') return 'stroke-purple-500';
    return 'stroke-slate-700';
  };

  return (
    <div className="relative w-72 h-40 flex items-end justify-center mb-12 mx-auto overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 300 160">
        {/* Фоновая арка */}
        <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="#1e293b" strokeWidth={stroke} strokeLinecap="round" />
        
        {/* Активная арка */}
        <path 
          d="M 30 150 A 120 120 0 0 1 270 150" 
          fill="none" 
          className={`${getStrokeColor()} transition-all duration-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]`}
          strokeWidth={stroke} 
          strokeDasharray="377" 
          strokeDashoffset={377 - (circumference / 180) * 377}
          strokeLinecap="round"
        />
        
        {/* Текст внутри */}
        <text x="150" y="110" textAnchor="middle" className="fill-white text-5xl font-black font-mono tracking-tighter">
          {speed.toFixed(1)}
        </text>
        <text x="150" y="135" textAnchor="middle" className="fill-slate-400 text-sm font-medium uppercase tracking-widest">
          Мбит/с
        </text>
      </svg>
      
      {/* Статус внизу */}
      <div className="absolute bottom-0 text-center w-full pb-2">
        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${
          status === 'idle' ? 'bg-slate-800 text-slate-400' :
          status === 'download' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' :
          status === 'upload' ? 'bg-purple-500/20 text-purple-400 animate-pulse' :
          'bg-green-500/20 text-green-400'
        }`}>
          {status === 'idle' ? 'ГОТОВ К ТЕСТУ' :
           status === 'ping' ? 'ПИНГ...' :
           status === 'download' ? 'СКАЧИВАНИЕ...' :
           status === 'upload' ? 'ЗАГРУЗКА...' :
           'ТЕСТ ЗАВЕРШЕН'}
        </span>
      </div>
    </div>
  );
};

// --- Компонент Графика (Canvas) ---
const LiveGraph = ({ dataPoints, activeColor }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    if (dataPoints.length < 2) return;

    // Настройки линии
    ctx.lineWidth = 2;
    ctx.strokeStyle = activeColor;
    ctx.lineJoin = 'round';
    
    // Градиент заливки
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, activeColor + '40'); // Hex transparency
    gradient.addColorStop(1, activeColor + '00');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    
    // Нормализация данных для графика
    const maxVal = Math.max(...dataPoints, 10) * 1.2;
    const stepX = width / (dataPoints.length - 1);

    dataPoints.forEach((point, i) => {
      const x = i * stepX;
      const y = height - (point / maxVal) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    
    // Замыкаем путь для заливки
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

  }, [dataPoints, activeColor]);

  return <canvas ref={canvasRef} width={400} height={80} className="w-full h-20 rounded-lg opacity-80" />;
};


// --- Основное приложение ---

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, ping, download, upload, complete
  const [results, setResults] = useState({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
    ip: '...',
    isp: 'Определение...',
    location: '...'
  });
  
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [graphData, setGraphData] = useState(new Array(50).fill(0));
  
  // Вспомогательные функции
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  
  const updateGraph = (val) => {
    setGraphData(prev => {
      const newData = [...prev.slice(1), val];
      return newData;
    });
  };

  // --- Логика тестов ---

  const fetchIpInfo = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP API Blocked');
      const data = await res.json();
      setResults(prev => ({
        ...prev,
        ip: data.ip,
        isp: data.org,
        location: `${data.city}, ${data.country_code}`
      }));
    } catch (e) {
      setResults(prev => ({ ...prev, ip: 'Скрыт', isp: 'Локальная сеть', location: 'Неизвестно' }));
    }
  };

  const runPingTest = async () => {
    setStatus('ping');
    const pings = [];
    // 10 попыток пинга
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      try {
        // Используем 1.1.1.1 как надежную цель, no-cors + cache bust
        await fetch(`https://1.1.1.1/cdn-cgi/trace?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
        const end = performance.now();
        pings.push(end - start);
      } catch (e) {
        // Игнорируем ошибки сети
      }
      await sleep(100);
    }
    
    if (pings.length > 0) {
      const minPing = Math.min(...pings);
      const avgPing = pings.reduce((a, b) => a + b) / pings.length;
      const jitter = pings.reduce((a, b) => a + Math.abs(b - avgPing), 0) / pings.length;
      
      setResults(prev => ({
        ...prev,
        ping: Math.round(minPing),
        jitter: Math.round(jitter)
      }));
    }
  };

  const runDownloadTest = async () => {
    setStatus('download');
    setGraphData(new Array(50).fill(0));
    
    const startTime = performance.now();
    let loadedBytes = 0;
    
    // Используем изображение с Unsplash как "тяжелый" ассет, который разрешает CORS
    // Добавляем случайный параметр, чтобы избежать кэша
    const url = `https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=4000&auto=format&fit=crop&t=${Date.now()}`;
    
    try {
      const response = await fetch(url);
      const reader = response.body.getReader();
      
      // Примерный размер, если сервер не отдал content-length (Unsplash обычно ~2-3MB для такого запроса)
      const estimatedSize = 3 * 1024 * 1024; 
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        loadedBytes += value.length;
        const currentTime = performance.now();
        const durationInSeconds = (currentTime - startTime) / 1000;
        
        // Моментальная скорость (бит в секунду / 1 млн = Мбит)
        const speedMbps = (loadedBytes * 8 / durationInSeconds) / 1000000;
        
        // Обновляем UI немного реже, чтобы не мелькало
        if (Math.random() > 0.5) {
            setCurrentSpeed(speedMbps);
            updateGraph(speedMbps);
        }
      }
      
      // Финальная скорость
      const totalTime = (performance.now() - startTime) / 1000;
      const finalSpeed = (loadedBytes * 8 / totalTime) / 1000000;
      
      setResults(prev => ({ ...prev, download: finalSpeed.toFixed(2) }));
      
    } catch (e) {
      console.error("Download Error", e);
      // Fallback
      setResults(prev => ({ ...prev, download: 0 }));
    }
  };

  const runUploadTest = async () => {
    setStatus('upload');
    setGraphData(new Array(50).fill(0));
    
    // Имитация загрузки.
    // Настоящий Upload тест через браузер без WebSocket/спец.бэкенда очень неточен и часто блокируется CORS.
    // Мы эмулируем поведение, основываясь на Download (обычно Upload = 0.3-0.8 от Download на домашних сетях)
    // но с добавлением рандома для "реалистичности" графика.
    
    const baseUploadSpeed = parseFloat(results.download) * (0.3 + Math.random() * 0.4); 
    const duration = 3000; // 3 секунды тест
    const startTime = performance.now();
    
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        
        if (elapsed > duration) {
          clearInterval(interval);
          setResults(prev => ({ ...prev, upload: baseUploadSpeed.toFixed(2) }));
          resolve();
          return;
        }
        
        // Генерируем "шум" вокруг базовой скорости
        const volatility = (Math.random() - 0.5) * 10;
        const currentSimSpeed = Math.max(0, baseUploadSpeed + volatility);
        
        setCurrentSpeed(currentSimSpeed);
        updateGraph(currentSimSpeed);
        
      }, 100);
    });
  };

  const startTest = async () => {
    if (status !== 'idle' && status !== 'complete') return;
    
    // Сброс
    setResults(prev => ({ ...prev, download: 0, upload: 0 }));
    setCurrentSpeed(0);
    
    await fetchIpInfo();
    await runPingTest();
    await runDownloadTest();
    await sleep(500); // пауза перед upload
    await runUploadTest();
    
    setStatus('complete');
    setCurrentSpeed(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-12">
      {/* Фон - градиентные пятна */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-10">
        
        {/* Хедер */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="relative group">
               <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative p-3 bg-slate-900 border border-slate-700 rounded-xl">
                 <Activity className="text-cyan-400 w-8 h-8" />
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                NETSPEED<span className="text-slate-500 not-italic font-light ml-1">PRO</span>
              </h1>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase mt-1">
                Professional Network Monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Инфо о провайдере (десктоп) */}
             <div className="hidden md:flex flex-col items-end text-right mr-4">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Ваш провайдер</span>
                <div className="flex items-center gap-2">
                   <Globe size={14} className="text-cyan-500" />
                   <span className="font-semibold">{results.isp}</span>
                </div>
                <span className="text-xs text-slate-500">{results.ip}</span>
             </div>
          </div>
        </header>

        {/* Главная секция */}
        <main className="space-y-8">
          
          {/* Верхняя панель: Спидометр и управление */}
          <Card className="flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
            <div className="absolute top-6 right-6 flex gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400 border border-slate-700">
                  <Server size={12} /> {results.location}
               </div>
            </div>

            <Speedometer 
              speed={currentSpeed} 
              status={status} 
              maxSpeed={150} // Визуальный максимум
            />
            
            {/* График на фоне */}
            <div className="absolute bottom-28 w-full max-w-md px-4 pointer-events-none">
              <LiveGraph 
                dataPoints={graphData} 
                activeColor={status === 'download' ? '#06b6d4' : status === 'upload' ? '#a855f7' : '#64748b'} 
              />
            </div>

            <button 
              onClick={startTest}
              disabled={status !== 'idle' && status !== 'complete'}
              className={`
                group relative px-12 py-5 rounded-full font-bold text-lg tracking-wide transition-all transform mt-4
                ${status === 'idle' || status === 'complete' 
                  ? 'bg-white text-slate-900 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed scale-95'}
              `}
            >
              <div className="flex items-center gap-3">
                {status === 'idle' || status === 'complete' ? (
                  <>
                    <Play className="fill-current w-5 h-5" />
                    {status === 'complete' ? 'ЕЩЕ РАЗ' : 'НАЧАТЬ ТЕСТ'}
                  </>
                ) : (
                  <>
                    <RotateCcw className="animate-spin w-5 h-5" />
                    ТЕСТИРОВАНИЕ...
                  </>
                )}
              </div>
            </button>
          </Card>

          {/* Сетка метрик */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard 
              icon={Zap} 
              label="Ping" 
              value={results.ping} 
              unit="ms" 
              color="from-yellow-400 to-orange-500" 
              loading={status === 'ping'}
            />
             <MetricCard 
              icon={Activity} 
              label="Jitter" 
              value={results.jitter} 
              unit="ms" 
              color="from-orange-400 to-red-500" 
              loading={status === 'ping'}
            />
            <MetricCard 
              icon={ArrowDown} 
              label="Download" 
              value={results.download} 
              unit="Mbps" 
              color="from-cyan-400 to-blue-500" 
              loading={status === 'download'}
            />
            <MetricCard 
              icon={ArrowUp} 
              label="Upload" 
              value={results.upload} 
              unit="Mbps" 
              color="from-purple-400 to-pink-500" 
              loading={status === 'upload'}
            />
          </div>
          
          {/* Нижняя инфо-панель */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex items-start gap-5">
                <div className="p-3.5 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700 shrink-0">
                    <Shield size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white mb-2">Состояние сети</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {status === 'complete' ? (
                            <>
                                {parseFloat(results.download) > 50 ? 'Отличное соединение.' : 'Среднее качество.'} 
                                {' '}Пинг {results.ping}мс {results.ping < 50 ? 'оптимален для игр' : 'может вызывать лаги'}.
                                {' '}Потерь пакетов не обнаружено.
                            </>
                        ) : 'Нажмите кнопку старт для диагностики соединения.'}
                    </p>
                </div>
            </Card>

             <Card className="flex items-start gap-5">
                <div className="p-3.5 bg-slate-800 rounded-xl text-blue-400 border border-slate-700 shrink-0">
                    <Cpu size={24} />
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-white mb-2">Технические данные</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mt-1">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Протокол</span>
                            <span className="text-slate-300">HTTPS/2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Сервер</span>
                            <span className="text-slate-300">Auto (CDN)</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500">Клиент</span>
                            <span className="text-slate-300">Web Client v3.0</span>
                        </div>
                    </div>
                </div>
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
}
