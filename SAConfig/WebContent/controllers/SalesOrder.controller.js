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
sap.ui.controller("sa.config.controllers.Sample", {
	onInit: function() {
		this.bundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
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
        oModel.read("Orders('VIS')/?$format=json&$expand=ProcessTypeSet,ProcessTypeSet/PartnerFunctionSet,ProcessTypeSet/SurveySet,ProcessTypeSet/OrderTextTypeSet", {
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
            	sap.ui.getCore().setModel(jsonModel,'visit');
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
		this.visitModel = sa.config.util.Utils.initOrderValue(processTypSet,this.visitModel,sap.ui.getCore().getModel('visit').getData());
		sap.ui.getCore().setModel(sa.config.util.Utils.getJSONModelData(this.visitModel),"processTypeSet");
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

      this._oDialog.setModel(this.getView().getModel());

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
        var aContexts = oEvent.getParameter("selectedContexts");  
        var processTypeSet = sap.ui.getCore().getModel("processTypeSet").getData().ProcessTypeSet;
        sa.config.util.Utils.handleSlectedDialog(aContexts,processTypeSet);
        sap.ui.getCore().getModel("processTypeSet").refresh();
        oEvent.getSource().getBinding("items").filter([]);
     },
     changeMultipFuntionBox:function(evt){
    	 var visitModel = sap.ui.getCore().getModel('visit');
    	 var processTypeModel = sap.ui.getCore().getModel("processTypeSet");
    	 sa.config.util.Utils.handleOrderMultipFuntion(visitModel,processTypeModel,evt);
     },
     /**
      * handle fixed switch
      */
     changeFixedSwitch:function(evt){
    	 var processTypeModel = sap.ui.getCore().getModel("processTypeSet");
    	 sa.config.util.Utils.handleFixedSwitch(processTypeModel,evt);
     },
     /**
      * handle visit select
      */
     changeVisitTextObject:function(evt){
    	 var visitModel = sap.ui.getCore().getModel('visit');
    	 var processTypeModel = sap.ui.getCore().getModel("processTypeSet")
    	 sa.config.util.Utils.handleVisitTextObject(visitModel,processTypeModel,evt);
     },
     changeSurveyObject:function(evt){
    	 var visitModel = sap.ui.getCore().getModel('visit');
    	 var processTypeModel = sap.ui.getCore().getModel("processTypeSet");
    	 sa.config.util.Utils.handleSurveyObject(visitModel,processTypeModel,evt);
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
		 sap.ui.getCore().getModel("processTypeSet").getData().ProcessTypeSet[parentObject].PartnerFunctionSet.splice(oObject,1);
    	 sap.ui.getCore().getModel("processTypeSet").refresh();
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
		var createVisitServiceUrl = sa.config.util.Config.getServiceUrl() + "Orders";
		var postData = sa.config.util.Utils.cloneObject(this.visitModel);	
		var processTypeSet = postData.ProcessTypeSet;
		sa.config.util.Utils.deleteElement(processTypeSet);
		 $.ajax({
	            url: createVisitServiceUrl,
	            type: "POST",
	            data: JSON.stringify(postData),
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
	        
	}

});