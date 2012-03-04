
  // If you want to prevent dragging, uncomment this section
  document.addEventListener("touchmove",
    function preventBehavior(e) {
      e.preventDefault();
    },
    false);

  /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
  see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
  for more details -jm */
  /*
  function handleOpenURL(url)
  {
    // TODO: do something with the url passed in.
  }
  */

  function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
  }

  /* When this function is called, PhoneGap has been initialized and is ready to roll */
  /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
  see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
  for more details -jm */
  function onDeviceReady() {
    // do your thing!
    //navigator.notification.alert("PhoneGap is working");
    var tinkle = new Media("static/sounds/twinkle.wav"),
        coin = new Media("static/sounds/coin.wav"),
        intro = new Media("static/sounds/intro.mp3"),
        theme = new Media("static/sounds/theme.mp3", function() {
          theme.play();
        }),
        start = $(".start a"),
        page = $(".page"),
        vol = $(".sound a"),
        sound = true;

    intro.play();

    vol.tap(function() {
      if(sound) {
        theme.pause();
      } else {
        theme.play();
      }
      sound = !sound;
    });

    start.bind("touchstart", function() {
      intro.stop();
      setTimeout(function() {
        coin.play();
        setTimeout(function() {
          page.addClass("one");
          tinkle.play();
          setTimeout(function() {
            theme.play();
          }, 3000)
        }, 1000);
      }, 100);
      return false;
    });
  }