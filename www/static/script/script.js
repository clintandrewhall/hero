
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

  function typeText(element, callback) {
    var text = element.innerHTML;
    element.style.height = element.offsetHeight + "px";
    element.innerHTML = "";
    element.style.visibility = "visible";

    var l = text.length,
        i = 0;

    function addLetter() {
      element.innerHTML += text[i];
      i++;
      if(i < l) {
        setTimeout(addLetter, 50);
      }
      else {
        if(callback) {
          callback();
        }
      }
    }

    addLetter();
  }

  function loadDashboard() {
    $("#dashboard .stats").bind("webkitTransitionEnd", function() {
      setTimeout(function() {
        $("#dashboard .dialog.wizard").bind("webkitAnimationEnd", function() {
          typeText($("#dashboard .dialog.wizard .typeable")[0]);
        }).addClass("show");
      }, 500);
    }).addClass("show");
  }

  function loadTown() {
    $("#welcome").bind("webkitTransitionEnd", function() {
      loadDashboard();
    });
    $("#welcome").addClass("hide");
    return false;
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

    page.bind("webkitTransitionEnd", function() {
      $("#welcome .wizard").bind("webkitAnimationEnd", function() {
        typeText($("#welcome .dialog .typeable")[0], function() {
          $("#welcome .choice").addClass("show");
        });
      }).addClass("show");
    });

    $("#welcome .choice").bind("tap", loadTown);

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
            coin.release();
            tinkle.release();
          }, 3000)
        }, 1000);
      }, 100);
      return false;
    });
  }

  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('8159432ab8d315714b65');
  var channel = pusher.subscribe('test_channel');
  channel.bind('my_event', function(data) {
    alert(data);
  });
