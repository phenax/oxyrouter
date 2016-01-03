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
		router.render_text(this.template, { get:JSON.stringify(dat,null,4) });
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


router.route({
	name: "part",
	url: "/test/part",
	template_url: "./part.html",
	data: {
		title: "Rendering from a template file"
	},
	success: function(dat) {
		alert("Loaded");
	}
});

router.route({
	name:'contact',
	url:'/contact',
	title: 'Contact Me',
	template:'#contact',
	data: {}
});