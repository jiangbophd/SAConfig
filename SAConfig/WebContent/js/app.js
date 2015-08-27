var oCore = sap.ui.getCore();
oCore.attachInit(function(){
	new sap.m.Shell("Shell", {
		showLogout : false,
		app : new sap.ui.core.ComponentContainer({
			name : 'sa.config'
		})
	}).placeAt('content');
	jQuery.sap.includeStyleSheet("css/style.css");
});