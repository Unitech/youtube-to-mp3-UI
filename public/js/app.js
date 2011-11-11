var id = 0;

function escapeHTML(data) {
    return data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

$(document).ready(function(){

    function find_by_id(id) {
	return $('.el-' + id);
    }

    function get_new(id) {
	var onelink = $('<div class="el-' + id + '"><input id="ulink" size="40"  type="text"/><span id="sub-zone"><input id="submit" type="button" value="download"/></span></div>');
	
	onelink.find('#submit').click(function(e) {
            e.preventDefault();

	    var el = find_by_id(id);
            var link = el.find('#ulink').val();
	    
	    console.log(link);
	    
	    if (link == '') {
		alert('Le lien ne doit pas etre vide');
		return false;
	    }
    	    //var old = onelink.find('#sub-zone').html();
	    
            $.ajax({
		type : "GET",
		url : '/send_link',
		data : {
                    'link' : escapeHTML(link)
		},
    		beforeSend : function(data) {
		    var download = $('<span id="down">Downloading</span>');

		    download.fadeIn(1500).fadeOut(1500);
		    setInterval(function() {
			download.fadeOut(1500).fadeIn(1500);
		    }, 1500);
		    
    		    el.find('#sub-zone').html(download);
    		},
		success : function(data) {
		    if (data.success == false) {
			el.find('#sub-zone').html('<span style="color : red">' + data.info + '</span>');
		    }
		    else {
    			var dwnl = $("<a target='_blank' href='/download?filename=" + data.file + "'>Download</a>");
			dwnl.click(function() {
			    $(this).append(' &nbsp; <img src="http://www.mricons.com/store/gif/85634_61691_checkmark_16x16.gif"/>');
			});
    			el.find('#sub-zone').html(dwnl);
		    }
		}
            });
	    
	});

	
	return onelink;
    }

    $('#listdown').append(get_new(id++));
    $('#listdown').append(get_new(id++));
    $('#listdown').append(get_new(id++));
    $('#listdown').append(get_new(id++));


    $('#add').click(function() {
	$('#listdown').append(get_new(id++));
    });
    
});

