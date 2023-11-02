sap.ui.define([

    "opensap/myapp/controller/BaseController",

    "sap/m/MessageBox",

    "sap/m/Text"

], function (BaseController, MessageBox, Text) {
    "use strict";

    return BaseController.extend("opensap.myapp.controller.UserData", {

        onInit: function () {
			// call the init function of the parent
			
			console.log('init sap users')
			

			// additional initialization can be done here

			
		},
        onAdd: function (oEvent) {
            console.log("add user");

        },

        onRemove: function (oEvent) {
            console.log("remove user")
            var oTable = this.byId("UserDataTable");
            if (oTable.getSelectedContexts(true).length === 0) {
                MessageBox.error("Select an user",  {
                    styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
                });
                return;
            }

            var sContext = oTable.getSelectedContexts()[0].getPath();
            var oModel = this.getModel("users")

            var message = new Text().bindText(sContext  + "/Stext");
            message.setModel(oModel)
                   
            MessageBox.confirm(`Do you want to delete ${message.getText()}?`, {
                onClose: (okcode) => {
                    if(okcode === "OK"){
                        console.log("delete");
                        console.log(oModel)
                    }
                }
            });

        },

        onUpdate: function (oEvent) {
            console.log("update user");

            var oTable = this.byId("UserDataTable");
            if (oTable.getSelectedContexts(true).length === 0) {
                MessageBox.information("Select an user",  {
                    styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
                });
                return;
            }

            var sContext = oTable.getSelectedContexts(true)[0].getPath();
            
        },

        onSelectionChange: function(oEvent) {
            var sContext = oEvent.getSource()._aSelectedPaths[0]
            console.log(sContext)
            
          }

    });
});