// Sample data request
var data = {
  size: 5, // get 5 results
  q: 'title:jones' // query on the title field for 'jones'
};

// Load the CKAN data
$.ajax({
  url: 'data/recently_changed_packages_activity_list.json',
  //url: 'http://opendata.admin.ch/api/3/action/recently_changed_packages_activity_list',
  	//{{endpoint}}/_search,
  	//dataType: 'jsonp',
  success: function(data) {
    //alert('Total results found: ' + data.result.length)
    var flakes = $('.flakes');
    $.each(data.result, function() {
    	flakes.append('<i></i>').find('i:last').data({
			'id':   	this.data.package.id,
			'title': 	this.data.package.title,
			'author':  	this.data.package.author,
    	});
    });
    var infobox = $('#legendbox .message');
    var baseurl = 'http://opendata.admin.ch/de/dataset/';
    flakes.find('i').on('mouseover click', function() {
    	var url = baseurl + $(this).data('id');
    	infobox.html(
    		'<a href="' + url + '" target="_blank">' +
    		$(this).data('title') + '</a> ' +
    		'(' + $(this).data('author') + ')');
    });

    // notify PACE
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

      // Hide the help text
      setTimeout(function() {
        $('#helpbox').fadeOut('slow');
      }, 10 * 1000);
    });
  }, 2 * 1000);
});

// Randomize the greetings order
var randomDivs = $(".banner h2").get().sort(function(){ 
  return Math.round(Math.random())-0.5;
});
$(randomDivs).appendTo(randomDivs[0].parentNode);