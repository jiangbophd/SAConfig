/**
 * Create by Richard
 */
jQuery.sap.require("sa.config.util.Config");
jQuery.sap.require("sa.config.util.Dialog");
jQuery.sap.require("sa.config.model.BussinessPartner");
sap.ui.controller("sa.config.controllers.UserManagement", {

	onInit: function() {
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		this.getView().setModel(i18nModel,'i18n');
		this.bundle = this.getView().getModel("i18n").getResourceBundle();
		this.busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('loading'));
		this.selectedUserArray = []; 
		this.getUserManagementData();
		this.getUserListData();
		
	},
	/**
	 * get select data from service
	 */
	getGeneralSupportData:function(){
		var that = this;
		var jsonModel = new sap.ui.model.json.JSONModel();
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.setHeaders({ "X-CSRF-TOKEN": "Fetch"});
        oModel.read("SaObjectSups/?format=json", {
            'success': function (data, response) {
            	jsonModel.setData(data);
            	that.getView().setModel(jsonModel,"Management");
            	that.initDefaultSelectValue();
            	that.busyDialog.close();
            },
            'error':function(){
            	that.busyDialog.close();
            }
        });
        oModel.refreshSecurityToken(function (data, response) {
            that.csrfToken = response.headers['x-csrf-token'];
        }, function (data) {
           
        }, true);
        
	},
	getUserManagementData:function(){
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.read("SalesAnywhereUserServices/?$format=json&$expand=SaUserObject", {
            'success': function (data, response) {
            	that.defaultDataSet = data;
            }
        });
	},
	getUserListData:function(){
		var that = this;
		this.busyDialog.open();
		var jsonModel = new sap.ui.model.json.JSONModel();
		var oModel = new sap.ui.model.odata.ODataModel(sa.config.util.Config.getServiceUrl(), true);
        oModel.read("UserServiceSups/?$format=json", {
            'success': function (data, response) {
            	jsonModel.setData(data);
            	that.getView().setModel(jsonModel,"User");
            	that.getGeneralSupportData();
            },
            'error':function(){
            	that.getGeneralSupportData();
            }
        });
	},
	/**
	 * set default selected value
	 */
	initDefaultSelectValue:function(){
		var defaultUserList = [];
		for(var i=0;i<this.defaultDataSet.results.length;i++){
			this.selectedUserArray.push(this.defaultDataSet.results[i].User);
			var singleUserInfo = {};
			singleUserInfo.UserId = this.defaultDataSet.results[i].User;
			singleUserInfo.UserName = this.defaultDataSet.results[i].UserName;
			singleUserInfo.selectedKeys = [];
			for(var j=0;j<this.defaultDataSet.results[i].SaUserObject.results.length;j++){
				singleUserInfo.UserName = this.defaultDataSet.results[i].SaUserObject.results[j].UserNameObject;
				singleUserInfo.selectedKeys.push(this.defaultDataSet.results[i].SaUserObject.results[j].Object);
			}
			
			defaultUserList.push(singleUserInfo);
		}
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData(defaultUserList);
    	this.getView().setModel(jsonModel,"DefaultUserList");
	},
	/**
	 * handle select dialog
	 */
	handleSelectDialogPress: function (oEvent) {
	    if (! this._oDialog) {
	        this._oDialog = sap.ui.htmlfragment("sa.config.view.UserSelectDialog", this);
	    }
      this._oDialog.setMultiSelect(true);
      this._oDialog.setModel(this.getView().getModel('User'));
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
    	
        var defaultUserList = this.getView().getModel("DefaultUserList").getData();
        var selectedUserSupportData = this.getView().getModel('User').getData();
        var returnFlag = sa.config.util.Utils.handleUserSelectDialog(defaultUserList,oEvent);
        if(returnFlag){
        	jQuery.sap.require('sap.m.MessageToast');
        	sap.m.MessageToast.show(this.bundle.getText('alreadyExists'));
        }
        this.getView().getModel("DefaultUserList").refresh();
        oEvent.getSource().getBinding("items").filter([]);
     },
     /**
 	 * handle select dialog live search
 	 */
 	liveSearch:function(evt){
 		var sVal = evt.getParameter("value");
         var itemsBinding = evt.getParameter("itemsBinding");
         
         itemsBinding.filter(!sVal ? [] : [new sap.ui.model.Filter(
         [
             new sap.ui.model.Filter("PartnerNumber", sap.ui.model.FilterOperator.Contains, sVal),
             new sap.ui.model.Filter("NameLast", sap.ui.model.FilterOperator.Contains, sVal)
         ],
         false)]);
 	},
 	/**
 	 * to destroy object when this view exit
 	 */
 	onExit: function() {
 		 if (this.busyDialog) {
 		      this.busyDialog.destroy();
 		 }
 	},
	/**
	 * create user data according to the selected data
	 */
	createUserManagement:function(evt){

		var that = this;
		var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('createUser'));
		busyDialog.open();
		var defaultUserList = this.getView().getModel("DefaultUserList").getData();
		var postData = {SaUser:[]};
		
		for(var i=0;i<defaultUserList.length;i++){
			if(defaultUserList[i].selectedKeys !== undefined){
				for(var j=0;j<defaultUserList[i].selectedKeys.length;j++){
					var selectedKey = defaultUserList[i].selectedKeys[j];
					var userItem = {SalesAnywhereObject:'',User:''};
					userItem.SalesAnywhereObject = selectedKey;
					userItem.User = defaultUserList[i].UserId;
					postData.SaUser.push(userItem);
				}
			}
		}
		
        var createUserServiceUrl = sa.config.util.Config.getServiceUrl() + "SalesAnywhereUserServices";
        $.ajax({
            url: createUserServiceUrl,
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
	},
	/**
	 * to delete the user item in list.
	 */
	handlerDelete:function(evt){
		 var id = evt.getParameter('id');
		 var sPath = evt.getParameter("listItem").oBindingContexts.DefaultUserList.sPath;
		 var b = sPath.split('/');
	     var oObject = b[b.length - 1];
		 var that = this;
		 var userId = this.getView().getModel("DefaultUserList").getData()[oObject].UserId;
		 if(this.checkUserIsValideInServer(userId)){
			 var busyDialog = sa.config.util.Dialog.getBusyDialog(this.bundle.getText('Delete'));
			 busyDialog.open();
			 $.ajax({
		            url: sa.config.util.Config.getServiceUrl()+"SalesAnywhereUserServices(User='"+userId+"',SalesAnywhereObject='')",
		            type: "DELETE",
		            headers: {
		                "X-CSRF-TOKEN": this.csrfToken
		            },
		            error: function (data, textStatus, jqXhr) {
		            	busyDialog.close();
		            },
		            success: function (data, status, xhr) {
		            	that.getView().getModel("DefaultUserList").getData().splice(oObject,1);
		            	that.getView().getModel("DefaultUserList").refresh();
		            	busyDialog.close();
		            },
		        });
		 }else{
			that.getView().getModel("DefaultUserList").getData().splice(oObject,1);
         	that.getView().getModel("DefaultUserList").refresh();
		 }
	},
	changeUserSAObject:function(evt){
		var defaultUserList = this.getView().getModel("DefaultUserList").getData();
		var saObjectList = this.getView().getModel("Management");
		var sourcePath = evt.getSource().mBindingInfos.items.path;
		var sPath = evt.getSource().oPropagatedProperties.oBindingContexts.DefaultUserList.sPath;
		var key = evt.getParameter('selectedItem').mProperties.key;
		var b = sPath.split('/');
		var parentPosition = b[b.length - 1];
		var parentObject = defaultUserList[parentPosition];
		var selectItems = evt.getSource().mAssociations.selectedItems;
		if(evt.getParameter('selected') === true){
			 var selectedPath = selectItems[selectItems.length-1];
			 var selectIndexArray = selectedPath.split('-');
			 var selectIndex = selectIndexArray[selectIndexArray.length-1];
			 var selectObject = saObjectList.getProperty(sourcePath+'/'+selectIndex);
			 parentObject.selectedKeys.push(selectObject.SaObject);
		}else{
			 for(var i=0;i<parentObject.selectedKeys.length;i++){
    			 if(key === parentObject.selectedKeys[i]){
    				 parentObject.selectedKeys.splice(i,1);    // remove item from list
    				 break;
    			 }
    		 }
		}
	},
	/**
	 * to check current user if it is exist in default user list from server.
	 * If there is exist in server data, will be return true, else return false.
	 */
	checkUserIsValideInServer:function(currentUerId){
		if(this.selectedUserArray.indexOf(currentUerId)>0 || this.selectedUserArray.indexOf(currentUerId) === 0){
			return true;
		}else{
			return false;
		}
		
	},
	/**
	 * to destroy object when this view exit
	 */
	onExit: function() {
		
	}

});