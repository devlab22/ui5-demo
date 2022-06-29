sap.ui.define([

	"sap/ui/model/Filter",

	"sap/ui/model/FilterOperator",

	"opensap/myapp/controller/BaseController"

], function (Filter, FilterOperator, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.NorthwindOrdersList", {

		_mFilters: {
			All: [],
			Ok: [new Filter("Freight", "LT", 5)],
			Normally: [new Filter("Freight", "BT", 5, 10)],
			Heavy: [new Filter("Freight", "BT", 10, 20)],
			Overweight: [new Filter("Freight", "GT", 20)]
		},

		onInit: function () {
			// call the init function of the parent
			//BaseController.prototype.onInit();
			console.log("init Orders List");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("northwindOrdersList").attachPatternMatched(this._onObjectMatched, this);

			// additional initialization can be done here
		},

		_onObjectMatched: function (oEvent) {
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").CustomerPath);

			/*
			this.getView().bindElement({
				path: sPath,
				model: "northwind"
			});
			*/

			var oParams = {
				"context": sPath,
				"title": true
			};
			this.setTable(oParams);
		},

		setTable: function (oParams) {

			var sContext = oParams["context"];
			var oList = this.byId("ordersList");

			if (oParams["panel"] == true) {
				var oPanel = this.byId("panelOrdersList");
				oPanel.bindElement(sContext);
				oPanel.bindProperty("headerText", "northwind>CompanyName");
			}

			if (oParams["title"] == true) {
				var oTitle = this.byId("title");
				oTitle.bindElement(sContext);
				oTitle.bindProperty("text", "northwind>CompanyName");
			}

			var sPath = oParams["context"] + "/Orders";
			console.log(sPath);

			var oTemplate = new sap.m.ObjectListItem({

				intro: "{northwind>CustomerID}",
				title: "{northwind>OrderID}",
				number: "{ path: 'northwind>Freight', type: 'sap.ui.model.type.Float', formatOptions: {maxFractionDigits: 2} }",
				numberUnit: "kg",
				numberState: {
					  path: 'northwind>Freight',
					  formatter: this.formatter.getFreightState
					},
				press: function(oEvent){
					console.log("press inner");

					var sPath = "northwind>" + oEvent.getSource().getBindingContext("northwind").getPath();
					console.log(sPath);
					this.navTo("northwindOrderDetailsList", {
						OrderPath: window.encodeURIComponent(sPath)
					});

				}.bind(this),
				type: sap.m.ListType.Navigation,
				attributes: [
					new sap.m.ObjectAttribute({
						title: "Order Date",
						text: "{path: 'northwind>OrderDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}"
					}),
					new sap.m.ObjectAttribute({
						title: "Required Date",
						text: "{path: 'northwind>RequiredDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}"
					}),
					new sap.m.ObjectAttribute({
						title: "Shipped Date",
						text: "{path: 'northwind>ShippedDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}"
					})
				],
				firstStatus: new sap.m.ObjectStatus({
					text: {
						path: 'northwind>Freight',
					    formatter: this.formatter.getFreightStatus 
					},
					state:  {
						path: 'northwind>Freight',
						formatter: this.formatter.getFreightState
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
			
			//oList.bindItems(sPath, oTemplate, null, null);
		},

		onUpdateFinished: function (oEvent) {
			console.log("onUpdateFinishedOrderTableExt");

			var oOrderTable = this.byId("ordersList");
			var oModel = oOrderTable.getBinding("items").getModel();
			var oBinding = oOrderTable.getBinding("items");
			var sPathOrder = oBinding.getPath();
			sPathOrder = sPathOrder + "/$count";

			var oTabData = {};
			oTabData["All"] = this.byId("All");
			oTabData["Ok"] = this.byId("Ok");
			oTabData["Normally"] = this.byId("Normally");
			oTabData["Heavy"] = this.byId("Heavy");
			oTabData["Overweight"] = this.byId("Overweight");
			//console.log(oTabData);


			jQuery.each(this._mFilters, function (sKey, oFilter) {
				oModel.read(sPathOrder, {
					filters: oFilter,
					success: function (oData) {
						var oTab = oTabData[sKey];
						if (oTab) {
							oTab.setProperty("count", oData);
						};

					}
				});
			});
		},

		onFilterSelectOrder: function (oEvent) {

			var oRouter = this.getRouter();
			console.log("router", oRouter);

			var sKey = oEvent.getParameter("key");
			console.log(sKey);

			var oFilter = this._mFilters[sKey];
			var oBinding = this.byId("ordersList").getBinding("items");
			if (oBinding) {
				oBinding.filter(oFilter);
			}
		}



	});
	
});

