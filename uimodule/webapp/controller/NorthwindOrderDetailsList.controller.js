sap.ui.define([

	"sap/ui/model/Filter",

	"sap/ui/model/FilterOperator",

	"opensap/myapp/controller/BaseController"

], function (Filter, FilterOperator, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.NorthwindOrderDetailsList", {

		_mFilters: {
			All: [],
			Ok: [new Filter("UnitPrice", "LT", 5)],
			Heavy: [new Filter("UnitPrice", "BT", 5, 50)],
			Overweight: [new Filter("UnitPrice", "GT", 50)]
		},

		onInit: function () {
			// call the init function of the parent
			console.log("init Order Details List");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("northwindOrderDetailsList").attachPatternMatched(this._onObjectMatched, this);

			// additional initialization can be done here
		},
		_onObjectMatched: function (oEvent) {
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").OrderPath);


			/*
			this.getView().bindElement({
				path: sPath,
				model: "northwind"
			});
			*/

			var oParams = {
				"context": sPath
			};
			this.setTable(oParams);
		},

		setTable: function (oParams) {

			var sContext = oParams["context"];
			var oList = this.byId("orderDetailsList");
			console.log("context",sContext);

			if (oParams["panel"] == true) {
				var oPanel = this.byId("panelOrdersList");
				oPanel.bindElement(sContext);
				oPanel.bindProperty("headerText", "northwind>CompanyName");
			}

			if (oParams["title"] == true) {
				var oTitle = this.byId("title");
				oTitle.bindElement(sContext);
				oTitle.bindProperty("text", "northwind>OrderID");
			}

			var sPath = sContext + "/Order_Details";
			console.log("path",sPath);

            var oTemplate = new sap.m.ObjectListItem({

                title: "{northwind>OrderID}",
                number: {
					   parts: [
						   {path: 'northwind>UnitPrice'},
						   {path: 'northwind>Quantity'},
						   {path: 'northwindModel>/currency'}
					   		],
					   formatter: this.formatter.calculatePriceWoCurrency
						},
				numberUnit: "{northwindModel>/currency}",
				attributes: [
					new sap.m.ObjectAttribute({
						title: "ProductID",
						text: "{northwind>ProductID}"
					}),
					new sap.m.ObjectAttribute({
						title: "Unit Price",
						text: { 
							parts: [
								 {path: 'northwind>UnitPrice'},
								 {path: 'northwindModel>/currency'}
							 ],
							  type: 'sap.ui.model.type.Currency',
							}
					}),
					new sap.m.ObjectAttribute({
						title: "Quantity",
						text: "{northwind>Quantity}"
					}),
					new sap.m.ObjectAttribute({
						title: "Discount",
						text: {
							path: 'northwind>Discount',
							formatter: this.formatter.getDiscountValueStr
							  }
					})
				],
				firstStatus: new sap.m.ObjectStatus({
					text: {
						path: 'northwind>UnitPrice',
						formatter: this.formatter.getPriceStatus
					},
					state: {
						path: 'northwind>UnitPrice',
						formatter: this.formatter.getPriceState
					}
				}),
				secondStatus: new sap.m.ObjectStatus({
					text: "second status"
				})


            });

			oList.bindAggregation("items", {
							path: sPath,
							template: oTemplate
			});
		},

		onUpdateFinished: function (oEvent) {
			console.log("onUpdateFinishedOrderTableExt");

			var oOrderTable = this.byId("orderDetailsList");
			var oModel = oOrderTable.getBinding("items").getModel();
			var oBinding = oOrderTable.getBinding("items");
			var sPathOrder = oBinding.getPath();
			sPathOrder = sPathOrder + "/$count";

			var oTabData = {};
			oTabData["All"] = this.byId("All");
			oTabData["Ok"] = this.byId("Ok");
			oTabData["Heavy"] = this.byId("Heavy");
			oTabData["Overweight"] = this.byId("Overweight");
			//console.log(oTabData);


			jQuery.each(this._mFilters, function (sKey, oFilter) {
				oModel.read(sPathOrder, {
					filters: oFilter,
					success: function (oData) {
						var sPath = "/" + sKey;
						//console.log("id: ", sKey );
						//console.log("count: ", oData);
						var oTab = oTabData[sKey];
						if (oTab) {
							oTab.setProperty("count", oData);
						};

					}
				});
			});
		},

		onFilterSelectOrder: function (oEvent) {

			var sKey = oEvent.getParameter("key");
			console.log(sKey);

			var oFilter = this._mFilters[sKey];
			var oBinding = this.byId("orderDetailsList").getBinding("items");
			if (oBinding) {
				oBinding.filter(oFilter);
			}
		}

	});
});