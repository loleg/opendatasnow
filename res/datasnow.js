var MAX_PACKAGES = 1848; // as of 23.12.2014
var NUM_RESULTS = 30;
var MAX_TITLE_LENGTH = 50;

// Prepare the data query
var start_at = Math.round(Math.random() * (MAX_PACKAGES-NUM_RESULTS));
var remote_url = 'http://opendata.admin.ch/api/3/action/package_search'
      + '?rows=' + NUM_RESULTS + '&start=' + start_at;

// Load the CKAN data
$.ajax({
  //url: 'data/package_search.json',
  url: remote_url,
  success: function(data) {
    var packages = data.result.results;
    //alert('Total results found: ' + packages.length)
    var flakes = $('.flakes');
    $.each(packages, function() {
      var title = this.title;
      console.log(title);
      if (title.length > MAX_TITLE_LENGTH) 
        title = title.substring(0, MAX_TITLE_LENGTH) + '...';
    	flakes.append('<i></i>').find('i:last').data({
			'id':   	this.id,
      'author': this.author,
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
    });
  },
  error: function(err) {
  	console.log(err.responseText);
  }
});

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
for (var i = 0; i < 50; i++) {
  setTimeout(function() {
    var pc = Math.round(Math.random() * 100) + '%';
    $heavyrain.append('<div class="raindrop" '+
        'style="left:' + pc + '"></div>');
  }, i * 100);
}

// Wait at least this long
Pace.on('done', function() {
  setTimeout(function() {
    $('.flakes').removeClass('hidden');
    $heavyrain.fadeOut(function() { 
      crossFade(); // start crossfader
      $(this).remove(); 

      // Set up the help text
      $('#helpbox, #legendbox').removeClass('hidden');
      setTimeout(function() {
        $('#helpbox').fadeOut('slow');
      }, 20 * 1000);
    });
  }, 2 * 1000);
});

// Randomize the greetings order
var randomDivs = $(".banner h2").get().sort(function(){ 
  return Math.round(Math.random())-0.5;
});
$(randomDivs).appendTo(randomDivs[0].parentNode);