/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.model.FunctionData");

sa.config.model.FunctionData = {
		getFunctionDataModel:function(){
			var functionDataModel = {
                 SalesAnywhereObject:'',
                 ProcessType:'',
                 SalesAnywherePartnerFunction:'',
                 PartnerFunctionKey:'',
                 Fixed:''
                 };

	        return functionDataModel;
		}
};