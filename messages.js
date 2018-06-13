(function(window) {
  const notificationEl = document.querySelector('.notification');
  const message = document.querySelector('.message');
  const animationDuration = 10; // seconds
  const delay = 10 // minutes
  const messageIn = new Audio('message-in.mp3');
  messageIn.volume = 0.95;
  const messageOut = new Audio('message-out.ogg');
  let messages;
  let timer;
  
  const displayNotification = animation => {
    timer = setTimeout(() => {
      let randomMessage = messages[Math.floor(Math.random() * messages.length)];
      message.innerHTML = randomMessage;
      
      animation.play();
    }, delay * 60 * 1000);
  };
  
  const messageAnimation = () => {
    const animationTimeline = anime.timeline({
      autoplay: false,
      loop: false,
      begin: anim => {
        messageIn.play();
      },
      run: anim => {
        if (Math.round(anim.progress) === 98) {
          messageOut.play();
        }
      },
      complete: anim => {
        clearTimeout(timer);
        anim.reset();
        displayNotification(anim);
      }
    });
    
    // Add animations to the timeline
    animationTimeline
      .add({
        targets: notificationEl,
        right: 0,
        duration: 500,
      })
      .add({
        targets: notificationEl,
        right: 0,
        scaleY: {
          value: [0.4, 1],
          easing: [0.390, 0.575, 0.565, 1.000],
        },
        duration: 500,
        delay: 25,
        offset: '-=150',
      })
      .add({
        targets: message,
        right: 0,
        opacity: [0, 1],
        duration: 200,
        easing: 'easeInSine',
        elasticity: 200,
        offset: '-=200',
      })
      .add({
        duration: (animationDuration * 1000) - 2000,
      })
      .add({
        targets: message,
        right: '-100%',
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInSine',
        elasticity: 200,
      })
      .add({
        targets: notificationEl,
        right: 0,
        scaleY: {
          value: [1, 0.4],
          easing: [0.390, 0.575, 0.565, 1.000],
        },
        duration: 600,
        delay: 25,
        offset: '-=150',
      })
      .add({
        targets: notificationEl,
        right: '-100%',
        duration: 500,
        offset: '-=50'
      });
    
    return animationTimeline;
  };
  
  window.addEventListener('load', () => {
    fetch('./messages.json').then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => {
      messages = data.messages;
      displayNotification(messageAnimation());
    });
  });
})(window);