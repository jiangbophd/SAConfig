/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.util.Utils");
jQuery.sap.require("sa.config.util.Dialog");
jQuery.sap.require("sa.config.model.OrderVisit");
jQuery.sap.require("sa.config.model.ProcessTypeItem");
jQuery.sap.require("sa.config.model.FunctionData");
jQuery.sap.require("sa.config.model.VisitTextData");
jQuery.sap.require("sa.config.model.SurveyData");
sa.config.util.Utils = {
		/**
		 * When the user change the tab, the tab background will be changed.
		 */
		setSelectedTab:function(selectedValue){
			window.tabType = selectedValue;
		},
		/**
		 * get current tab value.
		 */
		getSelectedTab:function(){
			if(window.tabType !== undefined){
				return window.tabType;
			}else{
				return '';
			}
		},
		/**
		 * convert json model to JsonModel
		 */
		getJSONModelData:function(dataModel){
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(dataModel);
			jsonModel.setDefaultBindingMode('TwoWay');
			return jsonModel;
		},
		/**
		 * clone a new model from origin model, 
		 * because we need to modify the structure of the model and to post it.
		 * at the same time, we can not change origin model.
		 */
		cloneObject:function(obj){
		  if(!obj||"object" != typeof obj){
			    return null;
			  }
			  var result = (obj instanceof Array)?[]:{};
			  for(var i in obj){
			    result[i] = ("object" != typeof obj[i])?obj[i]:this.cloneObject(obj[i]);
			  }
			  return result;
		},
		/**when we send the data to server, we need to modify the structure of the model,
		 * because the origin model contains the extra elements in order to bind data.
		 * so we must delete element to match with post data
		 */
		deleteElement:function(processTypeSet){
			for(var i=0;i<processTypeSet.length;i++){
				var partnerFunctionArray = processTypeSet[i].PartnerFunctionSet;
				for(var j=0;j<partnerFunctionArray.length;j++){
					delete partnerFunctionArray[j].state;
				}
				delete processTypeSet[i].surveySelectedKeys;
				delete processTypeSet[i].visitTextTypeSelectKeys
			}
		},
		/**
		 * when the user start the tile firstly, there is some default values for current page.
		 * So we need to set default value for order
		 */
		initOrderValue:function(processTypSet,orderModel,generalModel){
			var selectedProcessArray = [];
			for(var i=0;i<processTypSet.length;i++){
				selectedProcessArray.push(processTypSet[i].ProcessTypeKey);
				var processTypeItem = sa.config.model.ProcessTypeItem.getProcessTypeModel();
				processTypeItem.SalesAnywhereObject = processTypSet[i].SalesAnywhereObject;
				processTypeItem.ProcessTypeKey = processTypSet[i].ProcessTypeKey;
				/**
				 * set default value for partner function
				 */
				var partnerFunctionArray = processTypSet[i].PartnerFunctionSet.results;
				for(var j=0;j<partnerFunctionArray.length;j++){
					var functionDataItem = sa.config.model.FunctionData.getFunctionDataModel();
					functionDataItem.SalesAnywhereObject = partnerFunctionArray[j].SalesAnywhereObject;
					functionDataItem.ProcessType = partnerFunctionArray[j].ProcessType;
					functionDataItem.SalesAnywherePartnerFunction = partnerFunctionArray[j].SalesAnywherePartnerFunction;
					functionDataItem.PartnerFunctionKey = partnerFunctionArray[j].PartnerFunctionKey;
					functionDataItem.Fixed = partnerFunctionArray[j].Fixed;
					if(partnerFunctionArray[j].Fixed === 'X'){
						functionDataItem.state = true;
					}else{
						functionDataItem.state = false;
					}
					processTypeItem.PartnerFunctionSet.push(functionDataItem);
				}
				/**
				 * set default value for visit text object
				 */
				var visitTextArray = processTypSet[i].OrderTextTypeSet.results;
				var visitSelectedKeys = [];
				for(var k=0;k<visitTextArray.length;k++){
					var visitTextItem = sa.config.model.VisitTextData.getVisitTextDataModel();
					visitTextItem.TextID = visitTextArray[k].TextID;
					visitTextItem.TextObject = visitTextArray[k].TextObject;
					visitTextItem.ProcessType = visitTextArray[k].ProcessType;
					visitTextItem.SalesAnywhereObject = visitTextArray[k].SalesAnywhereObject;
					visitSelectedKeys.push(visitTextArray[k].TextID);
					processTypeItem.OrderTextTypeSet.push(visitTextItem);
				}
				processTypeItem.visitTextTypeSelectKeys = visitSelectedKeys;
				
				/**
				 * set default value for survey object
				 */
				var surveyArray = processTypSet[i].SurveySet.results
				var surveySelectedKeys = [];
				for(l=0;l<surveyArray.length;l++){
					var surveyDataItem = sa.config.model.SurveyData.getSurveyDataModel();
					surveyDataItem.SurveyId = surveyArray[l].SurveyId;
					surveyDataItem.ProcessType = surveyArray[l].ProcessType;
					surveyDataItem.SalesAnywhereObject = surveyArray[l].SalesAnywhereObject;
					surveySelectedKeys.push(surveyArray[l].SurveyId);
					processTypeItem.SurveySet.push(surveyDataItem);
				}
				processTypeItem.surveySelectedKeys = surveySelectedKeys;
				orderModel.ProcessTypeSet.unshift(processTypeItem);
			}
			/**
			 * set selected value for select dialog
			 * isSelected field is to check if the current item is selected.
			 * isSelected equals 'true'----> selected
			 * isSelected equals 'false' ----> not selected (default)
			 */
			var generalData = generalModel.ProcessTypeSupSet.results;
			for(var j=0;j<generalData.length;j++){
				if(selectedProcessArray.indexOf(generalData[j].ProcessType) > 0||selectedProcessArray.indexOf(generalData[j].ProcessType) === 0)
					generalData[j].isSelected = true;
			}
			return orderModel;
		},
		/**
		 * filter select dialog value for order
		 * to get selected keys from select dialog,because default method can not meet our requirements.
		 * oEvent.getParameter("selectedContexts");
		 * the above method only can get the items that part of the list. 
		 * but it is not ability to get items from the hidden list.
		 * Note:partial load for select dialog
		 */
		handleSlectedDialog:function(generalVisitData,processTypeSet,salesAnywhereObject){
			/**
			 * there is a new item is selected by user,
			 * we need to add it to processType list;
			 */
			var selectedContexts = [];
			for(var i=0;i<generalVisitData.length;i++){
	        	if(generalVisitData[i].isSelected != undefined&&generalVisitData[i].isSelected === true){
	        		selectedContexts.push(generalVisitData[i].ProcessType);
	        		var processTypeItem = sa.config.model.ProcessTypeItem.getProcessTypeModel();
		           	processTypeItem.SalesAnywhereObject = salesAnywhereObject;
		           	processTypeItem.ProcessTypeKey = generalVisitData[i].ProcessType;
		           	var flag = true;
		           	processTypeSet.map(function(item){
		           		if(generalVisitData[i].ProcessType === item.ProcessTypeKey){   //check exists
		           			flag = false;
		           			return;
		           		}
		           	});
		           	if(flag){
		           		 processTypeSet.unshift(processTypeItem);  //add new item to list
		           	}
	        	}
	        }
			 /**
	            * remove the item when the user unselected the item
	            */
			var deleteNrArray = [];
			for(var i=0;i<processTypeSet.length;i++){
	           	if (selectedContexts.length !== 0){
	           		var flag = true;
	           		for(var j=0;j<selectedContexts.length;j++){
	           			 if(selectedContexts[j] === processTypeSet[i].ProcessTypeKey){  //check exists
	                  			flag = false;
	                  		 }
	           		}
	           	  if(flag){
	           		deleteNrArray.push(i);
	           	  }
	           	}else{
	           		processTypeSet.splice(0,processTypeSet.length);  // if there is not any selected item, we need to remove all items from process list.
	           	}
	           }
			var flag = 0;
			for(var i=0;i<deleteNrArray.length;i++){
				if(flag !== 0){
					processTypeSet.splice(deleteNrArray[i]-flag, 1);  // remove item from list.
				}else{
					processTypeSet.splice(deleteNrArray[i], 1);   // remove item from list.
				}
                flag++;
			}
			
		},
		/**
		 * To handle user select dialog for user management page.
		 * the logic as above.
		 */
		handleUserSelectDialog:function(defaultUserList,evt){
			/**
			 * there is a new item is selected by user,
			 * we need to add it to processType list;
			 */
			var existFlag = false;
			var selectedContexts = evt.getParameter('selectedContexts');
			if(selectedContexts.length){
				selectedContexts.map(function(oContext){
					var userManagementItem = {};
	        		userManagementItem.UserId = oContext.getObject().PartnerNumber;
	        		userManagementItem.UserName = oContext.getObject().NameLast;
	        		userManagementItem.selectedKeys = [];
		           	var flag = true;
		           	defaultUserList.map(function(item){
		           		if(oContext.getObject().PartnerNumber === item.UserId){   //check exists
		           			flag = false;
		           			existFlag = true;
		           			return;
		           		}
		           	});
		           	if(flag){
		           		defaultUserList.unshift(userManagementItem);  //add new item to list
		           	}
				});
			}
			return existFlag;
		},
		/**
		 * handle multiple function for order
		 */
		handleOrderMultipFuntion:function(generalModel,processTypeModel,salesAnywhereObject,evt){
	         var sPath = evt.getParameter('selectedItem').oParent._oList.oPropagatedProperties.oBindingContexts.processTypeSet.sPath;
			 var parentObject = this.getParentObjectNr(sPath);
			 var sourcePath = evt.getSource().mBindingInfos.items.path;
			 var selectPath = evt.getSource().mAssociations.selectedItem;
			 var selectIndexArray = selectPath.split('-');
			 var selectIndex = selectIndexArray[selectIndexArray.length-1];
			 var selectObject = generalModel.getProperty(sourcePath+'/'+selectIndex);
			 var functionData = sa.config.model.FunctionData.getFunctionDataModel();
			 functionData.SalesAnywhereObject = salesAnywhereObject;
			 functionData.ProcessType = selectObject.ProcessType;
			 //where can I get it.
			 functionData.SalesAnywherePartnerFunction = 'ACCOUNT';
			 functionData.PartnerFunctionKey = selectObject.PartnerFunction;
			 functionData.Fixed = ' ';
			 functionData.state = false;
			 processTypeModel.getData().ProcessTypeSet[parentObject].PartnerFunctionSet.unshift(functionData);
			 processTypeModel.refresh();
		},
		/**
		 * handle fixed switch for order
		 */
		handleFixedSwitch:function(processTypeModel,evt){
	    	 var sPath = evt.getSource().oParent.oPropagatedProperties.oBindingContexts.processTypeSet.sPath;
			 if(evt.getSource().mProperties.state){
				 processTypeModel.getProperty(sPath).Fixed='X';
				 processTypeModel.getProperty(sPath).state = true;
			 }else{
				 processTypeModel.getProperty(sPath).Fixed=' ';
				 processTypeModel.getProperty(sPath).state = false;
			 }
		},
		/**
		 * handle visit text for order
		 */
		handleVisitTextObject:function(generalModel,processTypeModel,salesAnywhereObject,evt){
	    	 var sourcePath = evt.getSource().mBindingInfos.items.path;
			 var selectItems = evt.getSource().mAssociations.selectedItems;
	    	 var sPath = evt.getSource().oPropagatedProperties.oBindingContexts.processTypeSet.sPath;
	    	 var key = evt.getParameter('selectedItem').mProperties.key;
			 var parentObject = this.getParentObjectNr(sPath);
	    	 var OrderTextTypeSet = processTypeModel.getData().ProcessTypeSet[parentObject].OrderTextTypeSet;
	    	 /**
	    	  * For MultipleComboBox, when the user select one item, we need to add it to list,
	    	  * when the user unselected the item, we need to remove it from list.
	    	  */
	    	 if(evt.getParameter('selected') === true){
	    		 var selectedPath = selectItems[selectItems.length-1];
	    		 var selectIndexArray = selectedPath.split('-');
	    		 var selectIndex = selectIndexArray[selectIndexArray.length-1];
	    		 var selectObject = generalModel.getProperty(sourcePath+'/'+selectIndex);
	    		 var visitTextData = sa.config.model.VisitTextData.getVisitTextDataModel();
				 visitTextData.TextID = key;
				 visitTextData.TextObject = selectObject.TextObject;
				 visitTextData.ProcessType = selectObject.ProcessType;
				 visitTextData.SalesAnywhereObject = salesAnywhereObject;
	    		 OrderTextTypeSet.push(visitTextData);  // add item to list.
	    	 }else{
	    		 for(var i=0;i<OrderTextTypeSet.length;i++){
	    			 if(key === OrderTextTypeSet[i].TextObject){
	    				 OrderTextTypeSet.splice(i,1);  // remove it from list.
	    				 break;
	    			 }
	    			 
	    		 }
	    	 }
		},
		/**
		 * handle survey object for order
		 */
		handleSurveyObject:function(generalModel,processTypeModel,salesAnywhereObject,evt){
	    	 var sourcePath = evt.getSource().mBindingInfos.items.path;
			 var selectItems = evt.getSource().mAssociations.selectedItems;
	    	 var sPath = evt.getSource().oPropagatedProperties.oBindingContexts.processTypeSet.sPath;
	    	 var key = evt.getParameter('selectedItem').mProperties.key;
			 var parentObject = this.getParentObjectNr(sPath);
	    	 var OrderTextTypeSet = processTypeModel.getData().ProcessTypeSet[parentObject].SurveySet;
	    	 /**
	    	  * For MultipleComboBox, when the user select one item, we need to add it to list,
	    	  * when the user unselected the item, we need to remove it from list.
	    	  */
	    	 if(evt.getParameter('selected') === true){
	    		 var selectedPath = selectItems[selectItems.length-1];
	    		 var selectIndexArray = selectedPath.split('-');
	    		 var selectIndex = selectIndexArray[selectIndexArray.length-1];
	    		 var selectObject = generalModel.getProperty(sourcePath+'/'+selectIndex);
	    		 var visitTextData = sa.config.model.SurveyData.getSurveyDataModel();
	             visitTextData.SurveyId = key;
	             visitTextData.ProcessType = selectObject.ProcessType;
	             visitTextData.SalesAnywhereObject = salesAnywhereObject;
	    		 OrderTextTypeSet.push(visitTextData);  // add item to list
	    	 }else{
	    		 for(var i=0;i<OrderTextTypeSet.length;i++){
	    			 if(key === OrderTextTypeSet[i].TextObject){
	    				 OrderTextTypeSet.splice(i,1);    // remove item from list
	    				 break;
	    			 }
	    			 
	    		 }
	    	 }
		},
		/**
		 * create order(visit, lead, opp)
		 */
		createOrder:function(orderModel,bundleResource,csrfToken){
			var createVisitServiceUrl = sa.config.util.Config.getServiceUrl() + "Orders";
			var postData = this.cloneObject(orderModel);	
			var processTypeSet = postData.ProcessTypeSet;
			this.deleteElement(processTypeSet);
			var AXPromise = new $.Deferred();
			 $.ajax({
		            url: createVisitServiceUrl,
		            type: "POST",
		            data: JSON.stringify(postData),
		            contentType: "application/json",
		            headers: {
		                "X-CSRF-TOKEN": csrfToken,
		                "Content-Type": "application/json"
		            },
		            error: function (data, textStatus, jqXhr) {
		            	AXPromise.reject('failed');

		            },
		            success: function (data, status, xhr) {
		            	AXPromise.resolve('success');
		            },
		        });
			 return AXPromise.promise();
		},
		/**
		 * get parent object number
		 */
		getParentObjectNr:function(sPath){
			var b = sPath.split('/');
			return b[b.length - 1];
		}
};