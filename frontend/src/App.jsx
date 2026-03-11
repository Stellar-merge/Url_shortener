import { useState } from 'react'

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!originalUrl) return

    setIsLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await fetch('http://localhost:3000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalUrl: originalUrl.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }

  return (
    <>
      <div className="background">
        <div className="blob shape1"></div>
        <div className="blob shape2"></div>
        <div className="blob shape3"></div>
      </div>

      <main className="container glass-panel">
        <header>
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
            <h1>ZapLink</h1>
          </div>
          <p className="subtitle">Shorten your long links instantly.</p>
        </header>

        <section className="shortener-section">
          <form id="shortenForm" className="shortener-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <input 
                type="url" 
                id="urlInput" 
                placeholder="https://your-very-long-url.com/something" 
                required
                autoComplete="off"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
            <button type="submit" id="submitBtn" className="btn-primary" disabled={isLoading}>
              <span className={`btn-text ${isLoading ? 'hidden' : ''}`}>Shorten</span>
              {isLoading && <div className="loader" id="spinner"></div>}
            </button>
          </form>

          {error && (
            <div id="errorMessage" className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span id="errorText">{error}</span>
            </div>
          )}

          {shortUrl && (
            <div id="resultContainer" className="result-container">
              <p className="result-label">Your shortened URL is ready:</p>
              <div className="result-box">
                <a href={shortUrl} id="shortLink" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                <button id="copyBtn" className="btn-icon" aria-label="Copy to clipboard" title="Copy" onClick={handleCopy}>
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  )}
                </button>
              </div>
              <div className={`success-toast ${copied ? '' : 'hidden'}`} style={{ opacity: copied ? 1 : 0 }} id="copyToast">Copied to clipboard!</div>
            </div>
          )}
        </section>

        <footer>
          <p>ZapLink &copy; 2026. Made with ❤️ using React</p>
        </footer>
      </main>
    </>
  )
}

export default App
