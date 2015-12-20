function RxRouter(config) {                                                    // CONSTRUCTOR
	this.routes= {};
	this.otherwise= "/#"+config.otherwise;
	this.page= document.querySelector(config.page);

	this._listeners();
}

RxRouter.prototype._display_template= function(route) {                       // Templating side
	if(route.template) {                            // Show template from element
		this.page.innerHTML= document.querySelector(route.template).innerHTML;
	} else if(route.template_url) {                 // Show template from file
		/*var _this= this;

		// on success, execute route.success

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

RxRouter.prototype._sub_route= function(route,parts) {
	route.sub(parts[3]);
};

RxRouter.prototype.route_check= function() {                                 // Check if route exists
	var dir= "/"+window.location.hash;
	var small= dir.split("/");

	var route= this.routes[dir];
	var sub_route= this.routes[small.slice(0,3).join("/")];

	if(route) {                          // Route exists
		this._display_template(route);
	} else if(small.length == 4 && sub_route.sub) {
		this._sub_route(sub_route,small);
	} else {                                        // If it doesn't, goto `otherwise`.
		this.goto_link(this.otherwise);
	}
};

RxRouter.prototype._gogo_there= function(_this) {                             // Go to link in data-href
	var url= this.routes["/#"+_this.getAttribute("data-href")].url;
	this.goto_link(url);
};

RxRouter.prototype._listeners= function(page) {                               // data-href click listeners
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

RxRouter.prototype.goto_link= function(url) {                                 // Go to link
    window.location.replace(url);
    this.route_check();
};

RxRouter.prototype.route= function(data) {                                    // Set a route
	if(data.name && data.url && (data.template || data.template_url || data.text) && data.data) {
		data.url= "/#"+data.url;
		this.routes[data.url]= data;
	} else {                                        // Error
		console.error("Error in route definition.","\n",data);
	}
};




/* User stuff down here */

var rx= new RxRouter({
	otherwise: "/",
	page: ".container"
});

rx.route({
	name: "index",
	url: "/",
	template: "#index",
	data: {
		text: "Text some"
	}
});

rx.route({
	name: "about",
	url: "/about",
	text: "About Me",
	data: {
		text: "Text some"
	},
	sub: function(i) {
		alert(i);
	}
});

rx.route({
	name: "details",
	url: "/details",
	template: "#details",
	data: {
		text: "Text some"
	}
});

/*
rx.route({
	name: "about",
	url: "/about/mew",
	template_url: "./part.html",
	data: {
		text: "Text some"
	},
	success: function() {
		alert("loaded");
	}
});
*/

rx.route_check();
