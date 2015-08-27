/**
 * Create by Richard
 */
jQuery.sap.require("sa.config.util.Dialog");
jQuery.sap.require("sa.config.util.Config");
jQuery.sap.require("sa.config.util.Utils");
sap.ui.controller("sa.config.controllers.Overview", {
	
	onInit: function() {
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		this.getView().setModel(i18nModel,'i18n');
		this.bundle = this.getView().getModel("i18n").getResourceBundle();
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.loginApp();
	},
	/**
	 * the use need to type name and password when the application start firstly.
	 */
	loginApp:function(){
		var that = this;
		var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('loading'));
		busyDialog.open();
		var loginUrl = sa.config.util.Config.getServiceUrl();
		$.ajax({
            url: loginUrl,
            type: "GET",
            error: function (data, textStatus, jqXhr) {
            	busyDialog.close();
            },
            success: function (data, status, xhr) {
            	busyDialog.close();
            },
        });
	},
	/**
	 * navigate to visit page
	 */
	goToVisit:function(event){
		sa.config.util.Utils.setSelectedTab('visit');
		this.router.navTo("visit");
	},
	/**
	 * navigate to account page
	 */
	goToAccount:function(event){
		sa.config.util.Utils.setSelectedTab('account');
		this.router.navTo("account");
	},
	/**
	 * navigate to general page
	 */
	goToGeneral:function(event){
		
	},
	/**
	 * navigate to contact page
	 */
	goToContact:function(event){
		sa.config.util.Utils.setSelectedTab('contact');
		this.router.navTo("contact");
	},
	/**
	 * navigate to opp page
	 */
	goToOpp:function(event){
		sa.config.util.Utils.setSelectedTab('opp');
		this.router.navTo("opp");
	},
	/**
	 * navigate to task page
	 */
	goToTask:function(event){
		sa.config.util.Utils.setSelectedTab('task');
		this.router.navTo("task");
	},
	/**
	 * navigate to lead page
	 */
	goToLead:function(event){
		sa.config.util.Utils.setSelectedTab('lead');
		this.router.navTo("lead");
	},
	/**
	 * navigate to sales order page
	 */
	goToSalesOrder:function(event){
		sa.config.util.Utils.setSelectedTab('salesOrder');
		this.router.navTo("salesOrder");
	},
	/**
	 * navigate to user management page
	 */
	goToUserManagement:function(event){
		sa.config.util.Utils.setSelectedTab('userManagement');
		this.router.navTo("userManagement");
	}
	
});