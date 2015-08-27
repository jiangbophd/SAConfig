/**
 * create by Richard
 */
jQuery.sap.declare("sa.config.util.Dialog");

sa.config.util.Dialog = {
		/**
		 * busy loading
		 */
		getBusyDialog:function(busyTitle){
			var busyDialog = new sap.m.BusyDialog({
	            showCancelButton: false,
	            title: busyTitle
	        });
	        return busyDialog;
		},
		/**
		 * message dilaog according to the title and content
		 */
		getMessageDialog:function(dialogTitle,content,closeText){
	        var dialog = new sap.m.Dialog({
	            title: dialogTitle,
	            content: [new sap.m.Text({
	                text: content
	            })],
	            contentWidth: "30rem",
	            rightButton: new sap.m.Button({
	                text: closeText,
	                width: "30%",
	                press: function () {
	                    dialog.close();
	                }
	            }),
	            afterClose: function (evt) {
	                dialog.destroy();
	            }
	        });
	        return dialog;
		}
};
