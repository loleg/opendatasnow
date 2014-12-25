var MAX_PACKAGES = 1848; // as of 23.12.2014
var NUM_RESULTS = 30;
var MAX_TITLE_LENGTH = 50;
var NUM_RAINDROPS = 40;

// Prepare the data query
var start_at = Math.round(Math.random() * (MAX_PACKAGES-NUM_RESULTS));
var random_url = 'http://opendata.admin.ch/api/3/action/package_search'
      + '?rows=' + NUM_RESULTS + '&start=' + start_at;

var DEFAULT_URL = 'data/recently_changed_packages_activity_list.json';

Pace.on('done', function() {
	getDataFeed(DEFAULT_URL);
});
$('button.getrandompackages').click(function() {
	getDataFeed(random_url);
});

// Snow starts after data is loaded
function letItSnow() {
  if (!$('.flakes').hasClass('hidden')) return;
  setTimeout(function() {
    $('.flakes').removeClass('hidden');
    $heavyrain.fadeOut(function() { 
      // Set up the help text
      $('#helpbox, #legendbox').removeClass('hidden');

      // Start crossfader
      crossFade();
      $(this).remove(); 
    });
  }, 3 * 1000);
}

// Load the CKAN data
function getDataFeed(remote_url) {
  $.ajax({
  url: remote_url,
  success: function(data) {
    if (typeof data.result === 'undefined') {
	$('#heavyrain').html('Cannot read the data today, rainy weather continues...');
	console.log(data);
    }
    var packages = (typeof data.result.results === 'undefined') ?
	data.result : data.result.results;
    //alert('Total results found: ' + packages.length)
    var flakes = $('.flakes');
    flakes.find('i').remove();
    $.each(packages, function() {
	var pp = (typeof this.data === 'undefined') ? this : this.data.package;
      var title = pp.title;
      if (title.length > MAX_TITLE_LENGTH) 
        title = title.substring(0, MAX_TITLE_LENGTH) + '...';
    	flakes.append('<i></i>').find('i:last').data({
			'id':   	pp.id,
      'author': pp.author,
			'title': 	title,
    	});
    });
    var infobox = $('#legendbox .message');
    var baseurl = 'http://opendata.admin.ch/de/dataset/';
    flakes.find('i').on('mouseover click', function() {
    	var url = baseurl + $(this).data('id');
    	infobox.html(
    		'<a href="' + url + '" target="_blank">' +
    		$(this).data('title') + '</a> ' +
    		'(' + $(this).data('author') + ')').hide().fadeIn();
	// Highlight snowflake
	flakes.find('.active').removeClass('active');
	$(this).addClass('active');
    });
    letItSnow();
  },
  error: function(err) {
    $('#heavyrain').html('We are sorry, the data is not open today, rainy weather continues...');
    console.log(err.responseText);
  }
  }); // -ajax
}

// Set up crossfader
var crossTimer = 8, crossCurrent = 0;
var crossFade = function() {
  var images = $('.crossfade img').removeClass('active');
  $(images[crossCurrent]).addClass('active');
  crossCurrent = (crossCurrent == images.length-1) ? 0 : ++crossCurrent;
  setTimeout(crossFade, crossTimer * 1000);
}

// Set up heavy rain
var $heavyrain = $('#heavyrain');
for (var i = 0; i < NUM_RAINDROPS; i++) {
  setTimeout(function() {
    var pc = Math.round(Math.random() * 100) + '%';
    $heavyrain.append('<div class="raindrop" '+
        'style="left:' + pc + '"></div>');
  }, i * 100);
}

// Randomize the greetings order
var randomDivs = $(".banner h2").get().sort(function(){ 
  return Math.round(Math.random())-0.5;
});
$(randomDivs).appendTo(randomDivs[0].parentNode);
