function calculateTweetsPerDayFromDOM(success, failure) {
    
    // Assuming at this point that tweets have loaded.
    
    var timestamps = $('.tweet-timestamp');
    
    var timestamps_count = timestamps.length;
    
    if (timestamps_count == 0) {
        failure();
    }
    
    var unix_timestamps = [];
    
    $.each(timestamps, function(k,v) {
        
        var date_node = $(v).children()[0];
        
        var unix_timestamp = $(date_node).attr('data-time') / 1000;
    
        unix_timestamps.push(unix_timestamp);
    
    });
    
    unix_timestamps.sort();
    
    var oldest_timestamp = unix_timestamps[0];
    
    var newest_timestamp = unix_timestamps[timestamps_count - 1];
    
    var time_difference = newest_timestamp - oldest_timestamp;
    
    var days_between_first_and_last_post = time_difference / (60 * 60 * 24);
    
    var tweets_per_day_raw = timestamps_count / days_between_first_and_last_post;
    
    var tweets_per_day_formatted = Math.round( tweets_per_day_raw * 10 ) / 10;
    
    success(tweets_per_day_formatted);
    
}

// jQuery var, 
$user_stats = null;

// GET the .user-stats object after it's loaded
document.body.addEventListener("DOMNodeInserted", function(evt) { 

    var user_stats = $('.user-stats')[0];
    
    if (user_stats)        
        $user_stats = $(user_stats);

}, false);

// Listen for when tweets are loaded
document.body.addEventListener("DOMNodeInserted", function(evt) {

    // This will cause this to get re-calculated very frequently, any time the DOM changes
    
    // Prevent infinite loop
    var node = evt.target;
    if (node.tagName == "LI" || node.tagName == "A" || node.tagName == "SPAN")  return;
    
    calculateTweetsPerDayFromDOM( function(tweets_per_day) {
        
        if (isNaN(tweets_per_day)) return;
        
        // Try to find old dom node and re-use first, otherwise insert.

        var existing_dom = $('#tweets-per-day');

        if( existing_dom.length > 0 ) {

            existing_dom.text(tweets_per_day);

        } else {

            // insert new DOM
            if ($user_stats) {
                $('head').append('<style>.user-stats { overflow:visible !important }</style>');
                $user_stats.append('<li style="width:10px; overflow:visible"><a class="user-stats-count" href="http://twitter.com/tweets_per_day"><span id="tweets-per-day">' + tweets_per_day + '</span><span class="user-stats-stat">Tweets/Day</span></a></li>');
            }

        }
        
    }, function() {
        
        // Error
        
    });

});










