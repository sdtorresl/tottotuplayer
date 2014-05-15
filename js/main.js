// Setup energía player
$(document).ready(function() {
    
    var stream = {
        title: "Energia FM",
        // mp3: "http://stream02.exeamedia.com:8000/energiaweb02.mp3"
        mp3: "http://stream02.exeamedia.com:8000/elcorralwidgetyrespaldo"
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

// Facebook functions
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Twitter functions
!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
    if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
    }
}(document,"script","twitter-wjs");

(function($){
    $(window).load(function(){
        // Custom scrollbar for news
        $("#newsContainer").mCustomScrollbar();

        // Put styles for tweets tittle
        setTimeout(function() {
            var $head = $("#twitter-widget-0").contents().find("head");                
            $head.append($("<link/>", { rel: "stylesheet", href: '//fonts.googleapis.com/css?family=Podkova:400,700', type: "text/css" }));
        }, 1); 

        setTimeout(function(){
            $("#twitter-widget-0").contents().find('h1.summary a').css("font-size", "20px");
            $("#twitter-widget-0").contents().find('h1.summary a').css("font-family", "'Podkova', Sans-Serif");
            $("#twitter-widget-0").contents().find('h1.summary a').css("color", "#49524C");
            $("#twitter-widget-0").contents().find('h1.summary a').css("text-transform", "uppercase");
            $("#twitter-widget-0").contents().find('h1.summary a').css("text-decoration", "none");
            $("#twitter-widget-0").contents().find('h1.summary a').css("padding-left", "10px");
        }, 500);

        // Get info of the actual track
        //setInterval("updateMetadata()", 10000);   
    });
})(jQuery);

/** Get cover image with the artist name 
 *  and te track and change it in the player
 */ 
function changeCover(artist, track) {
    var cover;

    var url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=" + artist + "&track=" + track +"&api_key=4a23a53ccdf750dd38e56161e0741a7e&format=json";
    var trackInfo = JSON.parse(httpGet(url));
  
    try {
        cover = trackInfo['track']['album']['image'][1]["#text"];
    }
    catch(err) {
        cover = "http://localhost:8081/energiafmplayer/img/no-cover.png";
    }
    
    $("#cover img").attr("src", cover);
}

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
                title = json[1];
                
                $("#artist").html(artist);
                $("#title").html(title);

                if (previousArtist != undefined) {
                    $("#previousSong").html(previousArtist + ' - ' + previousTitle);
                }

                changeCover(artist, title);
            }
        }
    });
}