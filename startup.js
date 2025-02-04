document.addEventListener('DOMContentLoaded', () => {
  const startupScreen = document.getElementById('startup-screen');
  const desktop = document.getElementById('desktop');
  const startupSound = document.getElementById('startup-sound');
  const startButton = document.getElementById('start-os');

  startButton.addEventListener('click', () => {
    startButton.classList.add('hidden');
    
    if (startupSound) {
      try {
        const playPromise = startupSound.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            proceedWithStartup();
          }).catch(error => {
            console.log("Startup sound playback failed:", error);
            proceedWithStartup();
          });
        } else {
          proceedWithStartup();
        }
      } catch (err) {
        console.log("Error playing startup sound:", err);
        proceedWithStartup();
      }
    } else {
      proceedWithStartup();
    }
  });

  function proceedWithStartup() {
    setTimeout(() => {
      startupScreen.style.opacity = '0';
      startupScreen.style.transition = 'opacity 1s';
      
      setTimeout(() => {
        startupScreen.style.display = 'none';
        desktop.style.display = 'block';
        desktop.style.opacity = '0';
        
        desktop.offsetHeight;
        desktop.style.opacity = '1';
      }, 1000);
    }, 2000);
  }

  function updateClock() {
    const clock = document.getElementById('clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  }
  
  updateClock();
  setInterval(updateClock, 1000);
});