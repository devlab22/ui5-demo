sap.ui.define([

	"sap/m/MessageToast",

	"opensap/myapp/controller/BaseController"

], function (MessageToast, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.AddClothing", {


		onInit: function () {
			// call the init function of the parent

			console.log("init add clothing");
			var oRouter = this.getRouter();
			oRouter.getRoute("addClothing").attachPatternMatched(this._onObjectMatched, this);

			// additional initialization can be done here
		},

		_onObjectMatched: function (oEvent) {
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").ClothingPath);
			console.log(sPath);

			this.getView().bindElement({
				path: sPath,
				model: "clothing"
			});

			var oParams = {
				"context": sPath,
				"title": true
			};
			this.setData(oParams);
		},

		setData: function (oParams) {


		},
		
		onCancel: function(){
			this.onNavBack();
		},

		onSave: function(){

			var oParams = {};

			var sValue = this.byId("addCategory").getValue();
			if (sValue.length > 0){
				oParams["category"] = sValue;
			}

			var iPrice = parseFloat(this.byId("addPrice").getValue());
			if (iPrice > 0){
				oParams["price"] = iPrice;
			}

			var sItem = this.byId("addCurrency").getSelectedItem();
			if (sItem){
				oParams["currency"] = sItem.getProperty("key");
			}

			sItem = this.byId("addSize").getSelectedItem();
			if (sItem){
				oParams["size"] = sItem.getProperty("key");
			}

			var oResult = this.checkParams(oParams);

			MessageToast.show(oResult["msg"]);

			if (oResult["subrc"] > 0){
				return;
			}

			console.log(oParams);
		},

		checkParams: function(oParams){
			var oResult = {
				"subrc": 0,
				"msg": "data saved"
			};

			if (!oParams["category"]){
				oResult["subrc"] = 1;
				oResult["msg"] = "set category";
				return oResult;
			}

			if (oParams["price"] && !oParams["currency"]){
				oResult["subrc"] = 2;
				oResult["msg"] = "set currency";
				return oResult;
			}

			if (oParams["currency"] && !oParams["price"]){
				oResult["subrc"] = 3;
				oResult["msg"] = "set price";
				return oResult;
			}
			
			return oResult;

		}

	});
});