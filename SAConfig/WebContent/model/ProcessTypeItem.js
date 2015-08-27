/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.model.ProcessTypeItem");

sa.config.model.ProcessTypeItem = {
		getProcessTypeModel:function(){
			var processTypeItemModel = {
							            "SalesAnywhereObject":"",
							            "ProcessTypeKey":"",
							            "PartnerFunctionSet":[],
								        "OrderTextTypeSet":[],
								        "SurveySet":[]
								        };

	        return processTypeItemModel;
		}
};