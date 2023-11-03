/* eslint-disable no-unused-vars */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
sap.ui.define([

    "opensap/myapp/controller/BaseController"

], function (BaseController) {
    "use strict";

    return BaseController.extend("opensap.myapp.controller.treeData", {

        onInit: function () {
            // call the init function of the parent

            this.loadData();

            // additional initialization can be done here

        },

        loadData: function () {


            console.log("load tree data");
            var url = "/sap/opu/odata/sap/ZJB_TEST_UI5_SRV";
            var componentsModel = new sap.ui.model.odata.v2.ODataModel(url, true);
            this.setModel(componentsModel, "eventCatalog");
            //componentsModel.read("/MainMenuSet");
            console.log(componentsModel);

        }


    });
});