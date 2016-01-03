function OxyRouter(config) {                                                    // CONSTRUCTOR
	this.routes= {};
	this.otherwise= "/#"+config.otherwise;
	this.config= config;
	this.page= document.querySelector(config.page);

	this._hash_listener();
	this._listeners();
}

OxyRouter.prototype._hash_listener= function() {
	window.addEventListener('hashchange',this.route_check.bind(this));
};

OxyRouter.prototype._display_template= function(route) {                       // Templating side
	var _this= this;

	if(!route.data) {
		route.data= {};
	}

	if(route.template) {                            // Show template from element

		this.page.innerHTML= this._handlebar(document.querySelector(route.template).innerHTML,route.data);

	} else if(route.template_url) {                 // Show template from file

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				_this.page.innerHTML= _this._handlebar(xhttp.responseText,route.data);

				route.success("ok");
			}
		};

		xhttp.open("GET", route.template_url, true);
		xhttp.send();

	} else if(route.text) {                         // Show text
		this.page.textContent= route.text;
	} else {                                        // Error
		console.error(new Error("Error in route definition. No template specified in the route - "+route.name));
	}

	this._title(route.title || this.config.defaultTitle);
	this._listeners(this.config.page);
};

OxyRouter.prototype._sub_route= function(route,parts) {
	route.sub(parts[parts.length - 1]);
};

OxyRouter.prototype._listeners= function(page) {                               // data-href click listeners
	var select= document.querySelectorAll('[data-selected]');

	for(var i=0; i<select.length; i++) {
		var cl= select[i].dataset['selected'];
		var href= select[i].getAttribute('href');

		select[i].classList.remove(cl);

		if(href == "/"+window.location.hash) {
			select[i].classList.add(cl);
		}
	}
};

OxyRouter.prototype._title= function(title) {
	var elem_title= document.querySelector('title');
	if(!elem_title) {
		var elem= document.createElement('title');
		document.head.appendChild(elem);
		elem_title= elem;
	}

	document.querySelector('title').innerHTML= title;
};

OxyRouter.prototype._handlebar= function(html,data) {
	var stuff= Handlebars.compile(html);
	return stuff(data);
};

OxyRouter.prototype.route_check= function() {                                 // Check if route exists
	var dir= "/"+window.location.hash;
	var small= dir.split("/");
	dir= dir.split("?")[0];

	var route= this.routes[dir];
	var sub_route= this.routes[small.slice(0,small.length-1).join("/")];

	if(route) {                                     // Route exists
		this._display_template(route);
	} else if(small.length >= 4 && sub_route.sub) { // If sub-route exists, send it to them
		this._sub_route(sub_route,small);
	} else {                                        // If it doesn't, goto `otherwise`.
		this.goto_link(this.otherwise);
	}

	if(route || (small.length == 4 && sub_route.sub)) {
		if(route.get) {
			var get= this.parse_get(route);
			route.get(get);
		}
	}
};

OxyRouter.prototype.parse_get= function(route) {
	var get_content= [];
	var hash= window.location.hash;
	if(hash.indexOf('?') != -1) {
		var get= hash.split("?");
		get= get[1].split("&");

		for(var k in get) {
			var str= get[k].split("=");
			var key= str[0];
			var value= str[1];
			get_content.push({name: key, value: value});
		}
	}

	return get_content;
};

OxyRouter.prototype.goto_link= function(url) {                                 // Go to link
	var path= (window.location.pathname !== "/")? window.location.pathname : "";
    window.location.replace(path+url);
    this.route_check();
};

OxyRouter.prototype.route= function(data) {                                    // Set a route
	if(data.name && data.url && (data.template || data.template_url || data.text) && data.data) {
		data.url= "/#"+data.url;
		this.routes[data.url]= data;
	} else {                                        // Error
		console.error(new Error("Error in route config for "+data.url));
	}
};

OxyRouter.prototype.render_text= function(target,data) {
	target= document.querySelector(target).innerHTML;
	this.page.innerHTML= this._handlebar(target,data);
};



/* User stuff down here */

var router= new OxyRouter({
	otherwise: "/",
	page: ".container",
	defaultTitle: "OxyRouter"
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
	name: "details",
	title: "Tutorial - OxyRouter",
	url: "/details",
	template: "#details",
	data: {
		text: "Text some"
	}
});

router.route({
	name: "get_test",
	title: "Testing - OxyRouter",
	url: "/test/get",
	template: "#test",
	data: {},
	get: function(dat) {
		router.render_text(this.template, { get:dat });
	}
});

router.route({
	name: "test",
	title: "Testing - OxyRouter",
	url: "/test",
	template: "#just_test",
	data: {
		title: "Basic templating",
		wtf: [
			"Element #1",
			"Element #2",
			"Element #3",
			"Element #4",
			"Element #5"
		]
	}
});

var doing_something= function(data) {
	var data= data.split("_");
	for(val in data) {
		data[val]= data[val].split("");
		data[val][0]= data[val][0].toUpperCase();
		data[val]= data[val].join("");
	}
	return data.join(" ");
};
router.route({
	name: "sub_test",
	title: "Testing - OxyRouter",
	url: "/test/sub",
	template: "#sub",
	data: {},
	sub: function(data) {
		router.render_text(this.template, 
				{
					title:"SubRoute Data",
					sub:doing_something(data)
				});
	} 
});


/*router.route({
	name: "test",
	url: "/test",
	template: "#just_test",
	data: {
		title: "Basic templating",
		wtf: [
			"Element #1",
			"Element #2",
			"Element #3",
			"Element #4",
			"Element #5"
		]
	}
});*/


router.route_check();