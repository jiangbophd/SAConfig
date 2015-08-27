/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.model.OrderVisit");

sa.config.model.OrderVisit = {
		getVisitModel:function(){
			var visitModel = {
							   "SalesAnywhereObject":'',
							   "DefaultProcessType":'',
							   "HistoryRange":'',
							   "ProcessTypeSet":[]
							};
	        return visitModel;
		}
};