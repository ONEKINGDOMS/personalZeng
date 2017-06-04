 var currentFile = "";
 var myVar;
 var rotation = 0;
 var index;
 var songtitles = ["she_is_my_sin", "Dreamtale_-_The_Dawn", "ERA-The_Mass", "Chain_Hang_Low", "Lin_Hai_Pleasures"];
 $(function() {
     $("#songtilte").text(songtitles[0]);
     $("#head").click(function() {
         $(this).toggleClass("active");
         $(".options").each(function() {
             $(this).toggleClass("active");
         })
     })
     $(window).bind("pageshow", function(event) {
         if (event.originalEvent.persisted) {
             window.location.reload()
         }
     });
 })

 function randomAudio() {
     index = Math.round(4 * Math.random()) + 1;
     var filepath = "files/music/music" + index + ".mp3";
     $("#audiofile").val(filepath);
     var oAudio = document.getElementById('myaudio');
     var btn = document.getElementById('play');
     var audioURL = document.getElementById('audiofile');
     oAudio.pause();
     clearInterval(myVar);
     if (audioURL.value !== currentFile) {
         oAudio.src = audioURL.value;
         currentFile = audioURL.value;
     }
     oAudio.play();
     btn.textContent = "Pause";
     myVar = setInterval(function() {
         rotation += 5;
         $(".dishcover").css({
             '-webkit-transform': 'rotate(' + rotation + 'deg)',
             '-moz-transform': 'rotate(' + rotation + 'deg)',
             '-ms-transform': 'rotate(' + rotation + 'deg)',
             'transform': 'rotate(' + rotation + 'deg)'
         });
     }, 100)
     $(".dishcover").prop("src", "files/images/" + songtitles[index - 1] + ".jpeg");
     $("#songtilte").text(songtitles[index - 1]);
 }

 function playAudio() {
     // Check for audio element support.
     if (window.HTMLAudioElement) {
         try {
             var oAudio = document.getElementById('myaudio');
             var btn = document.getElementById('play');
             var audioURL = document.getElementById('audiofile');
             //Skip loading if current file hasn't changed.
             if (audioURL.value !== currentFile) {
                 oAudio.src = audioURL.value;
                 currentFile = audioURL.value;
             }
             // Tests the paused attribute and set state. 
             if (oAudio.paused) {
                 oAudio.play();
                 btn.textContent = "Pause";
                 myVar = setInterval(function() {
                     rotation += 5;
                     $(".dishcover").css({
                         '-webkit-transform': 'rotate(' + rotation + 'deg)',
                         '-moz-transform': 'rotate(' + rotation + 'deg)',
                         '-ms-transform': 'rotate(' + rotation + 'deg)',
                         'transform': 'rotate(' + rotation + 'deg)'
                     });
                 }, 100)
             } else {
                 oAudio.pause();
                 btn.textContent = "Play";
                 clearInterval(myVar);
             }
         } catch (e) {
             // Fail silently but show in F12 developer tools console
             if (window.console && console.error("Error:" + e));
         }
     }
 }