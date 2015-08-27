/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.model.BussinessPartner");

sa.config.model.BussinessPartner = {
		getPartnerModel:function(){
			var partnerModel = {
   				"SalesAnywhereObject":"",
   				"DefaultPartnerRole":"",
   				"PushDelete":"",
   				"BPRoleSet":[],
   				"BPTextTypeSet":[],
				"BPRelationshipCategorySet":[]};
	        return partnerModel;
		}
};