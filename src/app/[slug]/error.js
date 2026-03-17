'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          color: 'var(--accent)',
          marginBottom: '16px'
        }}>
          Ошибка
        </h1>
        <h2 style={{
          fontSize: '24px',
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          Что-то пошло не так
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          fontSize: '16px'
        }}>
          {error.message || 'Произошла непредвиденная ошибка'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
