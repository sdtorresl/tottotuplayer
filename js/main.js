// Setup energía player
$(document).ready(function() {
    
    var stream = {
        title: "Totto Radio",
        mp3: "http://stream.exeamedia.com/tottorelay"
    },
    ready = false;

    $("#jquery_jplayer_1").jPlayer({
        ready: function (event) {
            ready = true;
            $(this).jPlayer("setMedia", stream);
        },
        pause: function() {
            $(this).jPlayer("clearMedia");
        },
        error: function(event) {
            if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                // Setup the media stream again and play it.
                $(this).jPlayer("setMedia", stream).jPlayer("play");
            }
        },
        swfPath: "js",
        supplied: "mp3",
        preload: "none",
        wmode: "window",
        keyEnabled: true,
        cssSelectorAncestor: "#jp_container_1",
        autoPlay: true
    });
});

(function($){
    $(window).load(function(){
        $('#jquery_jplayer_1').jPlayer("play");
        updateMetadata();
        // Get info of the current track
        setInterval("updateMetadata()", 20000);   
    });
})(jQuery);


/** Make an http request and return the
 *  results in a string
 */
function httpGet(URL) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", URL, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var artist, title, previousArtist, previousTitle;

/** Update metadata of actual song 
 */
function updateMetadata() {

    data = 'tag=getTags';
    $.ajax({
        data: data,
        url: 'metadata.php',
        success: function(response) {
            var json = JSON.parse(response);

            if (json[0] != artist && json[1] != title) {
                previousArtist = artist;

                previousTitle = title;
            
                artist = json[0];
                if (artist.length > 23) {
                    artist = artist.substring(0, 20) + '...'; 
                }

                title = json[1];
                if (artist.length > 23) {
                    title = title.substring(0, 20) + '...'; 
                }

                $("#artist").html(artist);
                $("#title").html(title);

                if (previousArtist != undefined) {
                    $("#previousSong").html(previousArtist + ' - ' + previousTitle);
                }
            }
        }
    });
}