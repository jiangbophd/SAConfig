/**
 * Create by Richard
 */
jQuery.sap.declare("sa.config.Component");

sap.ui.core.UIComponent.extend("sa.config.Component", {
	metadata : {
		routing : {
			config : {
				viewType : "HTML",
				viewPath : "sa.config.view",
				targetControl : "navContainer",
				targetAggregation : "pages",
				transition: "show",
				clearTarget : false
			},
			routes : [{
				pattern : "",
				name : "overview",
				view : "Overview",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "visit",
				name : "visit",
				view : "Visit",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "account",
				name : "account",
				view : "Accounts",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "contact",
				name : "contact",
				view : "Contact",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "opp",
				name : "opp",
				view : "Opp",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "task",
				name : "task",
				view : "Task",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "lead",
				name : "lead",
				view : "Lead",
				viewType: "HTML",
				targetAggregation: "pages"
			},{
				pattern : "userManagement",
				name : "userManagement",
				view : "UserManagement",
				viewType: "HTML",
				targetAggregation: "pages"
			}]
		}
	},
	init : function() {
		jQuery.sap.require("sap.ui.core.routing.History");
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

		sap.ui.core.UIComponent.prototype.init.apply(this);

		var router = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();
	},
	destroy : function() {
		if (this.routeHandler) {
			this.routeHandler.destroy();
		}
		sap.ui.core.UIComponent.destroy.apply(this, arguments);
	},
	/**
	 * create root view
	 */
	createContent : function() {
		var view = sap.ui.view({
			id : "App",
			viewName : "sa.config.view.App",
			type : "HTML",
			viewData: {
				component: this
			}
		});
		return view;
	}
});


