var data = {
  size: 5, // get 5 results
  q: 'title:jones' // query on the title field for 'jones'
};

$.ajax({
  //url: 'data/recently_changed_packages_activity_list.json',
  url: 'http://opendata.admin.ch/api/3/action/recently_changed_packages_activity_list',
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
    var infobox = $('#legendbox .title');
    var baseurl = 'http://opendata.admin.ch/de/dataset/';
    flakes.find('i').on('mouseover click', function() {
    	var url = baseurl + $(this).data('id');
    	infobox.html(
    		'<a href="' + url + '" target="_blank">' +
    		$(this).data('title') + '</a> ' +
    		'(' + $(this).data('author') + ')');
    });

    $('#loading').fadeOut();
  },
  error: function(err) {
  	console.log(err.responseText);
  }
});