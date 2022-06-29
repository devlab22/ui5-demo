sap.ui.define([

    "opensap/myapp/controller/BaseController",

    "sap/m/MessageBox",

    "sap/m/Text"

], function (BaseController, MessageBox, Text) {
    "use strict";

    return BaseController.extend("opensap.myapp.controller.UserData", {

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

            var sContext = oTable.getSelectedContexts(true)[0].sPath;
            
            console.log(sContext);
            var message = new Text();
                   
            message.bindText({
                path: sContext,
                value: "{users>Stext}",
                model: "users"
            });
            
            console.log(message)
            MessageBox.confirm(message.getText(), {
                onClose: (okcode) => {
                    if(okcode === "OK"){
                        console.log("delete");
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

            var sContext = oTable.getSelectedContexts(true)[0].sPath;
            
        },

        onUserPress: function (oEvent) {
            console.log(oEvent)
        }

    });
});