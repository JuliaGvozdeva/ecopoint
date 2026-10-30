import { useEffect, useState } from 'react';
import type { HealthResponse } from '@ecopoint/contracts';

export function App() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetch('/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API health check failed');
        return response.json() as Promise<HealthResponse>;
      })
      .then(() => setApiStatus('online'))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setApiStatus('offline');
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Экологичный выбор начинается здесь</p>
        <h1>EcoPoint</h1>
        <p className="lead">
          Найдите в Саратове место, куда можно сдать вторсырьё, вещи или технику.
        </p>
        <div className="search-placeholder" aria-label="Поиск по материалам">
          <span aria-hidden="true">⌕</span>
          <span>Например, батарейки, макулатура, одежда…</span>
        </div>
        <p className={`api-status api-status--${apiStatus}`} role="status">
          {apiStatus === 'loading' && 'Проверяем подключение к API…'}
          {apiStatus === 'online' && 'API подключено — каркас приложения работает'}
          {apiStatus === 'offline' && 'API недоступно. Проверьте, запущен ли backend.'}
        </p>
      </header>

      <section className="intro" aria-labelledby="next-title">
        <h2 id="next-title">Следующий шаг</h2>
        <p>
          Добавим каталог пунктов, фильтры по материалам, карту и карточки с условиями приёма.
          Пока это стартовый каркас, а не готовый каталог.
        </p>
      </section>
    </main>
  );
}
