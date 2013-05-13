var Ghd = {};

Ghd.ROOT_PATH = 'http://localhost:8000/src';
Ghd.TWITTER_BOOTSTRAP = 'http://twitter.github.com/bootstrap';

/**
 * @type {jQuery}
 */
Ghd.allContainers = null;

/**
 * @type {Object}
 */
Ghd.containers = {};

/**
 * @type {Object}
 */
Ghd.hunks = {};

/**
 * Print obj on the console log if its available
 *
 * @param Object obj
 */
Ghd.log = function(obj) {
	if (console && console.log) {
		console.log(obj);
	}
};

/**
 * Inject a css to the head element
 */
Ghd.injectCss = function(cssLink) {
	var headNode = document.getElementsByTagName("head")[0];         
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = cssLink;
	cssNode.media = 'screen';	
	headNode.appendChild(cssNode);
};

Ghd.showContainerForPath = function(path) {
	Ghd.allContainers.hide();
	$container = Ghd.containers[path];
	$container.show();
};

/**
 * Create the browsing tree
 */
Ghd.createTree = function() {
	
	var $container = $('<div class="ghd-container"></div>'),
		$files = $('<ul class="ghd-files"></ul>').appendTo($container)
		;

	$.each(Ghd.hunks, function(path, hunks) {
		var $file = $('<li class="ghd-file"></li>');
		var $link = $('<a href="#" class="ghd-file-link" data-path="'+path+'">'+path+'</a>');

		$link.click(function(e) {

			e.stopPropagation();
			e.preventDefault();
			
			var $link = $(this);
			Ghd.showContainerForPath($link.data('path'));
			return false;
		});

		$file.append($link);
		$files.append($file);

		// TODO: append each hunks so we can jump to hunks

	});
	return $container;
};

/**
 * Initialize a bunch of event listeners
 */
Ghd.initEventListeners = function() {
	
};

/**
 * Initialize a bunch of stuff
 */
Ghd.init = function() {

	//Ghd.injectCss(Ghd.ROOT_PATH + '/browser.css');

	Ghd.initEventListeners();

	// get the containers
	var $containers = $('div.file.js-details-container');
	Ghd.allContainers = $containers;

	$containers.each(function() {
	    var $container = $(this).hide(),
	    	$meta = $container.find('.meta:first'),
	    	path = $meta.data('path'),
	    	$diffs = $container.find('table.diff-table tr')
	    	$tree = null
	    	;
	    Ghd.containers[path] = $container;

	    // get the hunks
	    Ghd.hunks[path] = [];

	    $diffs.each(function() {
	        var $line = $(this),
	        	$lol = $line.children().first(),
	        	hunkLineId = $lol.attr('id'),
	        	hunkContent = $line.find('pre.line:first').text()
	        	;
	        if ($lol.text().match(/\.\.\./)) {
	            Ghd.hunks[path].push({ id: hunkLineId, content: hunkContent });
	        }
	    });

	});

	$tree = Ghd.createTree();
	$tree.appendTo('body');

	Ghd.log('loaded diff-browser');
	Ghd.log(Ghd.hunks);

};


(function() {
	$(window.document).ready(function() {
		Ghd.init();
	});
})();
