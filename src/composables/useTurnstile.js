import { ref, onUnmounted, nextTick } from 'vue'

export function useTurnstile(siteKey) {
  const turnstileToken = ref(null)
  const turnstileWidgetId = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const loadTurnstileScript = () => {
    return new Promise((resolve, reject) => {
     
      if (window.turnstile) {
        resolve()
        return
      }

     
      if (document.querySelector('script[src*="turnstile"]')) {
        const checkTurnstile = () => {
          if (window.turnstile) {
            resolve()
          } else {
            setTimeout(checkTurnstile, 100)
          }
        }
        checkTurnstile()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      
      script.onload = () => {
       
        setTimeout(() => {
          if (window.turnstile) {
            resolve()
          } else {
            reject(new Error('Turnstile not available after script load'))
          }
        }, 100)
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Turnstile script'))
      }
      
      document.head.appendChild(script)
    })
  }

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidgetId.value) {
      try {
        window.turnstile.reset(turnstileWidgetId.value)
        turnstileToken.value = null
      } catch (err) {
        error.value = 'Error resetting Turnstile'
      }
    }
  }

  const renderTurnstile = (containerId) => {
    const container = document.getElementById(containerId)
    if (!container) {
      error.value = `Container with ID "${containerId}" not found`
      isLoading.value = false
      return
    }

    if (!window.turnstile) {
      error.value = 'Turnstile not loaded'
      isLoading.value = false
      return
    }

    if (!siteKey) {
      error.value = 'Site key not provided'
      isLoading.value = false
      return
    }

    try {
     
      container.innerHTML = ''
      
      turnstileWidgetId.value = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token) => {
          turnstileToken.value = token
          error.value = null
        },
        'error-callback': (err) => {
          error.value = `Turnstile error: ${err}`
          turnstileToken.value = null
        },
        'expired-callback': () => {
          turnstileToken.value = null
        },
        theme: 'light',
        size: 'normal'
      })
      isLoading.value = false
    } catch (err) {
      error.value = err.message
      isLoading.value = false
    }
  }

  const initTurnstile = async (containerId) => {
    isLoading.value = true
    error.value = null
    
    try {
      await loadTurnstileScript()
      await nextTick()
      renderTurnstile(containerId)
    } catch (err) {
      error.value = err.message
      isLoading.value = false
    }
  }

  const removeTurnstile = () => {
    if (window.turnstile && turnstileWidgetId.value) {
      try {
        window.turnstile.remove(turnstileWidgetId.value)
      } catch (err) {
        error.value = 'Error removing Turnstile widget'
      }
      turnstileWidgetId.value = null
      turnstileToken.value = null
    }
  }

  onUnmounted(() => {
    removeTurnstile()
  })

  return {
    turnstileToken,
    isLoading,
    error,
    initTurnstile,
    resetTurnstile,
    removeTurnstile
  }
}
