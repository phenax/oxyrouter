function Router(config) {                                                    // CONSTRUCTOR
	this.routes= {};
	this.otherwise= "/#"+config.otherwise;
	this.page= document.querySelector(config.page);
	this._listeners();
}

Router.prototype._display_template= function(route) {                       // Templating side
	if(route.template) {                            // Show template from element
		this.page.innerHTML= document.querySelector(route.template).innerHTML;
	} else if(route.template_url) {                 // Show template from file
		/*var _this= this;

		$.get(route.template_url,function(template_content) {
			_this.page.innerHTML= (template_content);
		});*/
	} else if(route.text) {                         // Show text
		this.page.textContent= route.text;
	} else {                                        // Error
		console.error("Error in route definition. No template specified.","\n",route);
	}

	this._listeners('main');
};

Router.prototype._check_route= function() {                                 // Check if route exists
	var dir= "/"+window.location.hash;

	if(this.routes[dir]) {                          // Route exists
		this._display_template(this.routes[dir]);
	} else {                                        // It doesn't. Goto `otherwise`.
		this.goto_link(this.otherwise);
	}
};

Router.prototype._gogo_there= function(_this) {                             // Go to link in data-href
	var url= this.routes["/#"+_this.getAttribute("data-href")].url;
	this.goto_link(url);
};

Router.prototype._listeners= function(page) {                               // data-href click listeners
	var _this= this;
	var href;

	if(page) {                                      // If `page` exists, select buttons inside page.
		href= document.querySelectorAll('main [data-href]');
	} else {
		href= document.querySelectorAll('[data-href]');
	}

	var exec_call= function() {
		_this._gogo_there(this);
	};

	for(var d=0; d< href.length; d++) {             // Loop through elements
		href[d].removeEventListener('click',exec_call);
		href[d].addEventListener('click',exec_call);
	}
};

Router.prototype.goto_link= function(url) {                                 // Go to link
    window.location.replace(url);
    this._check_route();
};

Router.prototype.route= function(data) {                                    // Set a route
	if(data.name && data.url && (data.template || data.template_url || data.text) && data.data) {
		data.url= "/#"+data.url;
		this.routes[data.url]= data;
	} else {                                        // Error
		console.error("Error in route definition.","\n",data);
	}
	this._check_route();                            // Call to check url at every route
};




/* User stuff down here */

var router= new Router({
	otherwise: "/",
	page: "main"
});

router.route({
	name: "index",
	url: "/",
	template: "#index",
	data: {
		text: "Text some"
	}
});

router.route({
	name: "about",
	url: "/about",
	text: "About Me",
	data: {
		text: "Text some"
	}
});

router.route({
	name: "contact",
	url: "/contact",
	template: "#conta",
	data: {
		text: "Text some"
	}
});