
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

  var CLICK = "click";

  function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
  }

  function typeText(element, callback) {
    if(element.typing) return;
    console.log("Typing text: " + element);
    element.typing = true;
    var text = element.innerHTML;
    element.style.height = element.offsetHeight + "px";
    element.innerHTML = "";
    element.style.visibility = "visible";

    text = text.replace(/^\s+|\s+$/g,"");
    var l = text.length,
        i = 0;

    function cancel() {
      i = l;
      element.innerHTML = text;
      $(document).unbind(CLICK, cancel);
    }

    $(document).bind(CLICK, cancel);

    function addLetter(element, text) {
      element.innerHTML += text[i] ? text[i] : "";
      i++;
      if(i < l && text[i]) {
        setTimeout(function() {
          addLetter(element, text);
        }, 50);
      }
      else {
        $(document).unbind(CLICK, cancel);
        element.typing = false;
        if(callback) {
          callback();
        }
      }
    }

    addLetter(element, text);
  }

  function popDialog(text, className) {
    if($(".dialog.popped")[0]) return;

    className = className || "";

    showScreen(true, function() {
      var d = "<article class='dialog popped " + className + "'>";
        d += "<div class='dialog-inner'>";
        d += "<p class='typeable'>";
        d += text;
        d += "</p></div</article>";

      $(".page").append(d);

      var dialog = $(".dialog.popped");
      dialog.bind("webkitAnimationEnd", function() {
        typeText($(".dialog.popped .typeable")[0]);
      }).addClass("show");
    });

    function cancel() {
      $(".dialog.popped").remove();
      showScreen();
      $(document).unbind(CLICK, cancel);
    }

    $(document).bind(CLICK, cancel);
  }

  function showScreen(b, callback) {
    var s = $(".screen"),
        d = function() {
          if(callback) callback();
          s.unbind("webkitTransitionEnd", d);
        };
    
    s.bind("webkitTransitionEnd", d);
    b ? s.addClass("show") : s.removeClass("show");
  }

  function loadQuest() {
    $(".show").removeClass("show");
    $("#quest").bind("webkitTransitionEnd", function() {
      $("#quest .stats").addClass("show");
      setTimeout(function() {
        
      }, 500);
    }).addClass("show");
    return false;
  }

  function loadHouse() {
    $(".show").removeClass("show");
    $("#house").bind("webkitTransitionEnd", function() {
      $("#house .stats").addClass("show");
      setTimeout(function() {
        $(".badges").bind("webkitAnimationEnd", function() {
          $(".avatar").bind("webkitAnimationEnd", function() {
            $(".messages").bind("webkitAnimationEnd", function() {
              setTimeout(function() {
                $("#house .choice").addClass("show");
              }, 500);
            }).addClass("show");
          }).addClass("show");
        }).addClass("show");
      }, 500);
    }).addClass("show");
    return false;
  }

  function loadTown() {
    $(".show").removeClass("show");
    $("#dashboard").bind("webkitTransitionEnd", function() {
      $("#dashboard .stats").bind("webkitTransitionEnd", function() {
        setTimeout(function() {
          $("#dashboard .dialog.wizard").bind("webkitAnimationEnd", function() {
            typeText($("#dashboard .dialog.wizard .typeable")[0]);
          }).addClass("show");
        }, 500);
      }).addClass("show");
    }).addClass("show");
    return false;
  }

  /* When this function is called, PhoneGap has been initialized and is ready to roll */
  /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
  see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
  for more details -jm */
  function onDeviceReady() {

    CLICK = device.platform ? "touchstart" : CLICK;
    alert(CLICK);

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

    $("#welcome .choice").bind(CLICK, loadTown);

    intro.play();

    vol.tap(function() {
      if(sound) {
        theme.pause();
      } else {
        theme.play();
      }
      sound = !sound;
    });

    start.bind(CLICK, function() {
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

    $("a[rel='town']").bind(CLICK, loadTown);
    $("a[rel='house']").bind(CLICK, loadHouse);
    $("a[rel='quest']").bind(CLICK, loadQuest);
  }

  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('8159432ab8d315714b65');
  var channel = pusher.subscribe('test_channel');
  channel.bind('my_event', function(data) {
    popDialog(data);
  });
