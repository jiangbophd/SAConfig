/**
 * create by Richard
 */
jQuery.sap.require("sa.config.util.Config");
jQuery.sap.require("sa.config.util.Utils");
jQuery.sap.require("sa.config.util.Dialog");
jQuery.sap.require("sa.config.model.OrderVisit");
jQuery.sap.require("sa.config.model.ProcessTypeItem");
jQuery.sap.require("sa.config.model.FunctionData");
jQuery.sap.require("sa.config.model.VisitTextData");
jQuery.sap.require("sa.config.model.SurveyData");
sap.ui.controller("sa.config.controllers.Lead", {
	onInit: function() {
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		this.getView().setModel(i18nModel,'i18n');
		this.bundle = this.getView().getModel("i18n").getResourceBundle();
		this.visitModel = sa.config.model.OrderVisit.getVisitModel();	
		this.getDefaultData();
		this.getVisitData();
	},
	/**
	 * get default data value
	 */
	getDefaultData:function(){
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.read("Orders('LEA')/?$format=json&$expand=ProcessTypeSet,ProcessTypeSet/PartnerFunctionSet,ProcessTypeSet/SurveySet,ProcessTypeSet/OrderTextTypeSet", {
            'success': function (data, response) {
            	that.defaultDataSet = data;
            }
        });
	},
	/**
	 * init the visit page data
	 */
	getVisitData:function(){
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
            	that.getView().setModel(jsonModel,'visit');
            	that.initDefaultValues();
            	busyDialog.close();
            }
        });
        oModel.refreshSecurityToken(function (data, response) {
            that.csrfToken = response.headers['x-csrf-token'];
        }, function (data) {
           
        }, true);
	},
	/**
	 * set defalut value
	 */
	initDefaultValues:function(){
		var processTypSet = this.defaultDataSet.ProcessTypeSet.results;
		this.visitModel.SalesAnywhereObject = this.defaultDataSet.SalesAnywhereObject;
		this.visitModel.DefaultProcessType = this.defaultDataSet.DefaultProcessType;
		this.visitModel.HistoryRange = this.defaultDataSet.HistoryRange;
		this.visitModel = sa.config.util.Utils.initOrderValue(processTypSet,this.visitModel,this.getView().getModel('visit').getData());
		this.getView().setModel(sa.config.util.Utils.getJSONModelData(this.visitModel),"processTypeSet");
	},
		
	/**
	 * handle select dialog
	 */
	handleSelectDialogPress: function (oEvent) {
	    if (! this._oDialog) {
	        this._oDialog = sap.ui.htmlfragment("sa.config.view.SelectDialog", this);
	    }

      this._oDialog.setMultiSelect(true);

      this._oDialog.setRememberSelections(true);

      this._oDialog.setModel(this.getView().getModel('visit'));

      jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
      this._oDialog.open();
    },
    /**
     * handle search function for dialog
     */
    handleSearch: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
        	oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },
    /**
     * close select dialog
     */
    handleClose: function(oEvent) {
    	var that = this;
        var processTypeSet = this.getView().getModel("processTypeSet").getData().ProcessTypeSet;
        var generalVisitData = this.getView().getModel('visit').getData().ProcessTypeSupSet.results;
        sa.config.util.Utils.handleSlectedDialog(generalVisitData,processTypeSet,'LEA');
        this.getView().getModel("processTypeSet").refresh();
        oEvent.getSource().getBinding("items").filter([]);
     },
     changeMultipFuntionBox:function(evt){
    	 var visitModel = this.getView().getModel('visit');
    	 var processTypeModel = this.getView().getModel("processTypeSet");
    	 sa.config.util.Utils.handleOrderMultipFuntion(visitModel,processTypeModel,'LEA',evt);
     },
     /**
      * handle fixed switch
      */
     changeFixedSwitch:function(evt){
    	 var processTypeModel = this.getView().getModel("processTypeSet");
    	 sa.config.util.Utils.handleFixedSwitch(processTypeModel,evt);
     },
     /**
      * handle visit select
      */
     changeVisitTextObject:function(evt){
    	 var visitModel = this.getView().getModel('visit');
    	 var processTypeModel = this.getView().getModel("processTypeSet")
    	 sa.config.util.Utils.handleVisitTextObject(visitModel,processTypeModel,'LEA',evt);
     },
     changeSurveyObject:function(evt){
    	 var visitModel = this.getView().getModel('visit');
    	 var processTypeModel = this.getView().getModel("processTypeSet");
    	 sa.config.util.Utils.handleSurveyObject(visitModel,processTypeModel,'LEA',evt);
     },
    /**
     * delete the item
     */
	handlerDelete:function(evt){
		 var id = evt.getParameter('id');
		 var sPath = evt.getParameter("listItem").oBindingContexts.processTypeSet.sPath;
		 var b = sPath.split('/');
		 var parentObject = b[b.length - 3];
	     var oObject = b[b.length - 1];
		 this.getView().getModel("processTypeSet").getData().ProcessTypeSet[parentObject].PartnerFunctionSet.splice(oObject,1);
    	 this.getView().getModel("processTypeSet").refresh();
	},
	/**
	 * handle select dialog live search
	 */
	liveSearch:function(evt){
		var sVal = evt.getParameter("value");
        var itemsBinding = evt.getParameter("itemsBinding");
        
        itemsBinding.filter(!sVal ? [] : [new sap.ui.model.Filter(
        [
            new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sVal),
            new sap.ui.model.Filter("ProcessType", sap.ui.model.FilterOperator.Contains, sVal)
        ],
        false)]);
	},
	/**
	 * to destroy object when this view exit
	 */
	onExit: function() {
		 if (this._oDialog) {
		      this._oDialog.destroy();
		 }
	},
	/**
	 * create visit 
	 */
	createVisit:function(){
		var that = this;
		var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('createVisit'));
		busyDialog.open();
		$.when(sa.config.util.Utils.createOrder(this.visitModel,this.bundle,this.csrfToken)).then(function(httpResult){
			busyDialog.close();
        	var messageDialog = sa.config.util.Dialog.getMessageDialog(that.bundle.getText('success'),that.bundle.getText('success'),that.bundle.getText('close'));
        	messageDialog.open();
		}).fail(function(httpResult){
			busyDialog.close();
        	var messageDialog = sa.config.util.Dialog.getMessageDialog(that.bundle.getText('error'),that.bundle.getText('error'),that.bundle.getText('close'));
        	messageDialog.open();
		});  
	}
});