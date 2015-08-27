/**
 * Create by Richard
 */
jQuery.sap.require("sa.config.util.Config");
jQuery.sap.require("sa.config.util.Dialog");
jQuery.sap.require("sa.config.model.BussinessPartner");
sap.ui.controller("sa.config.controllers.Accounts", {

	onInit: function() {
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		this.getView().setModel(i18nModel,'i18n');
		this.bundle = this.getView().getModel("i18n").getResourceBundle();
	},
	/**
	 * set default selected value
	 */
	initDefaultSelectValue:function(){
		if(this.defaultDataSet){
			var roleKeySet = {defaultRoleSelect:'',roleSelectedSet:[],textObjectKeySet:[],accountRelations:[]};
			for(var i=0;i<this.defaultDataSet.BPRoleSet.results.length;i++){
				roleKeySet.roleSelectedSet.push(this.defaultDataSet.BPRoleSet.results[i].RoleKey);
			}
			for(var j=0;j<this.defaultDataSet.BPTextTypeSet.results.length;j++){
				roleKeySet.textObjectKeySet.push(this.defaultDataSet.BPTextTypeSet.results[j].TextID);
			}
			for(var k=0;k<this.defaultDataSet.BPRelationshipCategorySet.results.length;k++){
				roleKeySet.accountRelations.push(this.defaultDataSet.BPRelationshipCategorySet.results[k].RelationCategoryKey);
			}
		}
		var selectedModel = new sap.ui.model.json.JSONModel();
		selectedModel.setData(roleKeySet);
		this.getView().setModel(selectedModel,'selectedKey');
	},
	/**
	 * get select data from service
	 */
	getGeneralSupportData:function(){
		var that = this;
		var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('loading'));
		busyDialog.open();
		var that = this;
		var jsonModel = new sap.ui.model.json.JSONModel();
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.setHeaders({ "X-CSRF-TOKEN": "Fetch"});
        oModel.read("GeneralSupports('EN')/?$format=json&$expand=BPTextSupSet,LanguageSupSet,OrderTextTypeSupSet,PartnerFunctionSupSet,ProcessTypeSupSet,RelationshipCategorySupSet,RoleSupSet,SaObjectSupSet,SaPartnerFuncSupSet,SurveySupSet", {
            'success': function (data, response) {
            	jsonModel.setData(data);
            	that.getView().setModel(jsonModel,"Account");
            	that.initDefaultSelectValue();
            	busyDialog.close();
            }
        });
        oModel.refreshSecurityToken(function (data, response) {
            that.csrfToken = response.headers['x-csrf-token'];
        }, function (data) {
           
        }, true);
	},
	getAccountData:function(){
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.read("BusinessPartners('ACC')/?$format=json&$expand=BPRoleSet,BPTextTypeSet,BPRelationshipCategorySet", {
            'success': function (data, response) {
            	that.defaultDataSet = data;
            }
        });
	},
	/**
	 * create account according to the selected data
	 */
	createAccount:function(evt){

		var that = this;
		var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('createAccount'));
		busyDialog.open();
		var sendData = sa.config.model.BussinessPartner.getPartnerModel();
		sendData.SalesAnywhereObject = this.defaultDataSet.SalesAnywhereObject;
		sendData.DefaultPartnerRole = this.defaultDataSet.DefaultPartnerRole;
		sendData.PushDelete = this.defaultDataSet.PushDelete;
		var roleMultiComboBox = this.getView().byId("roleSetMultiComboBox");
		for(var i=0;i<roleMultiComboBox.getSelectedKeys().length;i++){
			var roleSetData = {"SalesAnywhereObject":"ACC","RoleKey":roleMultiComboBox.getSelectedKeys()[i]};
			sendData.BPRoleSet.push(roleSetData);
		}
		
		var accountTextMultiComboBox = this.getView().byId("accountTextMultiComboBox");
		for(var i=0;i<accountTextMultiComboBox.getSelectedItems().length;i++){
			var accountTextData = {
		            "SalesAnywhereObject":this.defaultDataSet.SalesAnywhereObject,
		            "TextObject":accountTextMultiComboBox.getSelectedItems()[i].getText(),
		            "TextID":accountTextMultiComboBox.getSelectedItems()[i].getKey()
		         	};
			sendData.BPTextTypeSet.push(accountTextData);
		}
		
		var accountRelationsMultiComboBox = this.getView().byId("accountRelationsMultiComboBox");
		for(var i=0;i<accountRelationsMultiComboBox.getSelectedKeys().length;i++){
			var accountCategoryData = { "SalesAnywhereObject":this.defaultDataSet.SalesAnywhereObject,
		            "RelationCategoryKey":accountRelationsMultiComboBox.getSelectedKeys()[i],
		            "Fixed":"X"};
			sendData.BPRelationshipCategorySet.push(accountCategoryData);
		}
		
        
        var createAcountServiceUrl = sa.config.util.Config.getServiceUrl() + "BusinessPartners";
        $.ajax({
            url: createAcountServiceUrl,
            type: "POST",
            data: JSON.stringify(sendData),
            contentType: "application/json",
            headers: {
                "X-CSRF-TOKEN": this.csrfToken,
                "Content-Type": "application/json"
            },
            error: function (data, textStatus, jqXhr) {
            	busyDialog.close();
            	var messageDialog = sa.config.util.Dialog.getMessageDialog(that.bundle.getText('error'),that.bundle.getText('error'),that.bundle.getText('close'));
            	messageDialog.open();
            },
            success: function (data, status, xhr) {
            	busyDialog.close();
            	var messageDialog = sa.config.util.Dialog.getMessageDialog(that.bundle.getText('success'),that.bundle.getText('success'),that.bundle.getText('close'));
            	messageDialog.open();
            },
        });
	},
	/**
	 * to destroy object when this view exit
	 */
	onExit: function() {
		
	}

});