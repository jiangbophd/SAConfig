/**
 * Create by Richard
 */
jQuery.sap.require("sa.config.util.Utils");
sap.ui.controller("sa.config.controllers.Menu", {
	
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
	},

	onBeforeRendering: function() {

	},

	onAfterRendering: function() {	
		this.updateSelectedTab();
	},
	/**
	 * navigate to visit page
	 */
	goToVisit:function(event){
		sa.config.util.Utils.setSelectedTab('visit');
		this.router.navTo("visit");
		this.updateSelectedTab();
	},
	/**
	 * navigate to account page
	 */
	goToAccount:function(event){
		sa.config.util.Utils.setSelectedTab('account');
		this.router.navTo("account");
		this.updateSelectedTab();
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
		this.updateSelectedTab();
	},
	/**
	 * navigate to opp page
	 */
	goToOpp:function(event){
		sa.config.util.Utils.setSelectedTab('opp');
		this.router.navTo("opp");
		this.updateSelectedTab();
	},
	/**
	 * navigate to task page
	 */
	goToTask:function(event){
		sa.config.util.Utils.setSelectedTab('task');
		this.router.navTo("task");
		this.updateSelectedTab();
	},
	/**
	 * navigate to lead page
	 */
	goToLead:function(event){
		sa.config.util.Utils.setSelectedTab('lead');
		this.router.navTo("lead");
		this.updateSelectedTab();
	},
	/**
	 * navigate to sales order page
	 */
	goToSalesOrder:function(event){
		sa.config.util.Utils.setSelectedTab('salesOrder');
		this.router.navTo("salesOrder");
		this.updateSelectedTab();
	},
	/**
	 * navigate to user management page
	 */
	goToUserManagement:function(event){
		sa.config.util.Utils.setSelectedTab('userManagement');
		this.router.navTo("userManagement");
		this.updateSelectedTab();
	},
	goToIndex:function(event){
		sa.config.util.Utils.setSelectedTab('');
		this.router.navTo("#");
		this.updateSelectedTab();
	},
	updateSelectedTab:function(){
		var tabType = sa.config.util.Utils.getSelectedTab();
		$(".mainNav .menuItem").removeClass("current");
		$('.'+tabType+'').addClass("current");
	},
	onExit: function() {

	}
});
