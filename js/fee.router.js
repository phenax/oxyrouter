function FEERouter(config) {                                                    // CONSTRUCTOR
	this.routes= {};
	this.otherwise= "/#"+config.otherwise;
	this.config= config;
	this.page= document.querySelector(config.page);

	this._listeners();
}

FEERouter.prototype._display_template= function(route) {                       // Templating side
	if(route.template) {                            // Show template from element
		this.page.innerHTML= this._handlebar(document.querySelector(route.template).innerHTML);
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

	this._listeners(this.config.page);
};

FEERouter.prototype._sub_route= function(route,parts) {
	route.sub(parts[3]);
};

FEERouter.prototype._gogo_there= function(_this) {                             // Go to link in data-href
	var url= this.routes["/#"+_this.getAttribute("data-href")].url;
	this.goto_link(url);
};

FEERouter.prototype._listeners= function(page) {                               // data-href click listeners
	var _this= this;
	var href,check,exec_call,selector,selec;

	check= (page)? false : true;

	href= document.querySelectorAll('[data-href]');

	exec_call= function() {
		_this._gogo_there(this);
	};

	if(!check) {
		selec= document.querySelectorAll(page+' [data-href]');

		for(var i= 0; i< selec.length; i++) {
			selec[i].removeEventListener('click',exec_call);
			selec[i].addEventListener('click',exec_call);
		}
	}

	for(var d= 0; d< href.length; d++) {             // Loop through elements

		if(check) {
			href[d].removeEventListener('click',exec_call);
			href[d].addEventListener('click',exec_call);
		}

		var sel= href[d].getAttribute('data-selected');

		if(sel) {
			if(href[d].getAttribute('data-href') == (window.location.hash).split("#")[1]) {
				href[d].classList.add(sel);
			} else {
				href[d].classList.remove(sel);
			}
		} else {
			href[d].classList.remove(sel);
		}
	}
};

FEERouter.prototype._handlebar= function(html) {
	return html;
};

FEERouter.prototype.route_check= function() {                                 // Check if route exists
	var dir= "/"+window.location.hash;
	var small= dir.split("/");

	var route= this.routes[dir];
	var sub_route= this.routes[small.slice(0,3).join("/")];

	if(route) {                                     // Route exists
		this._display_template(route);
	} else if(small.length == 4 && sub_route.sub) { // If sub-route exists, send it to them
		this._sub_route(sub_route,small);
	} else {                                        // If it doesn't, goto `otherwise`.
		this.goto_link(this.otherwise);
	}
};

FEERouter.prototype.goto_link= function(url) {                                 // Go to link
    window.location.replace(url);
    this.route_check();
};

FEERouter.prototype.route= function(data) {                                    // Set a route
	if(data.name && data.url && (data.template || data.template_url || data.text) && data.data) {
		data.url= "/#"+data.url;
		this.routes[data.url]= data;
	} else {                                        // Error
		console.error("Error in route definition.","\n",data);
	}
};

FEERouter.prototype.render_text= function(data) {
	this.page.innerHTML= this.handlebar(data);
};




/* User stuff down here */

var router= new FEERouter({
	otherwise: "/",
	page: ".container"
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
	},
	sub: function(i) {
		alert(i);
	}
});

router.route({
	name: "details",
	url: "/details",
	template: "#details",
	data: {
		text: "Text some"
	}
});

/*
router.route({
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

router.route_check();
