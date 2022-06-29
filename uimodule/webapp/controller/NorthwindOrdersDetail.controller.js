sap.ui.define([

	"sap/ui/model/Filter",

	"sap/ui/model/FilterOperator",

	"opensap/myapp/controller/BaseController"

], function (Filter, FilterOperator, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.NorthwindOrdersDetail", {

		_mFilters: {
			All: [],
			Ok: [new Filter("Freight", "LT", 5)],
			Heavy: [new Filter("Freight", "BT", 5, 50)],
			Overweight: [new Filter("Freight", "GT", 50)]
		},

		onInit: function () {
			// call the init function of the parent
			console.log("init Orders EXT");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("northwindOrders").attachPatternMatched(this._onObjectMatched, this);

			// additional initialization can be done here
		},
		_onObjectMatched: function (oEvent) {
			var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").CustomerPath);
			console.log("set path orders");
			console.log(sPath);

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

			if (oParams["panel"] == true) {
				var oPanel = this.byId("panelOrder");
				oPanel.bindElement(sContext);
				oPanel.bindProperty("headerText", "northwind>CompanyName");
			}

			if (oParams["title"] == true) {
				var oTitle = this.byId("OrderTitle");
				oTitle.bindElement(sContext);
				oTitle.bindProperty("text", "northwind>CompanyName");
			}

			var sPath = oParams["context"] + "/Orders";
			console.log(sPath);

			var oTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.ObjectIdentifier({
						title: "{northwind>OrderID}"
					}),
					new sap.m.Text({
						text: "{northwind>EmployeeID}",
						wrapping: false
					}),
					new sap.m.Text({
						text: "{path: 'northwind>OrderDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}",
						wrapping: false
					}),
					new sap.m.Text({
						text: "{path: 'northwind>RequiredDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}",
						wrapping: false
					}),
					new sap.m.Text({
						text: "{path: 'northwind>ShippedDate', type: 'sap.ui.model.type.Date', formatOptions: { style: 'medium', strictParsing: true}}",
						wrapping: false
					}), ,
					new sap.m.ObjectNumber({
						number: "{ path: 'northwind>Freight', type: 'sap.ui.model.type.Float', formatOptions: {maxFractionDigits: 2} }",
						unit: "kg"
					}),
					new sap.m.Text({
						text: "{northwind>CustomerID}"
					})
				]
			});

			var oTable = this.byId("OrderTable");
			oTable.bindItems(sPath, oTemplate, null, null);
			console.log("end Orders table");
		},

		onUpdateFinishedOrderTable: function (oEvent) {
			console.log("onUpdateFinishedOrderTableExt");

			var oOrderTable = this.byId("OrderTable");
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
			var oBinding = this.byId("OrderTable").getBinding("items");
			if (oBinding) {
				oBinding.filter(oFilter);
			}
		},

		onOrderPress: function (oEvent) {
			console.log("order pressed");
			var sPath = "northwind>" + oEvent.getParameters("listItem")["listItem"].oBindingContexts["northwind"].sPath
			
			//var sPath = "northwind>" + this.byId("OrderTable").getSelectedContexts(true)[0];
			console.log(sPath);

			this.navTo("northwindOrderDetails", {
				OrderPath: window.encodeURIComponent(sPath)
			});
			
		},

		onSearchOrder: function(oEvent){
			console.log("search order table");

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			var oTable = this.getView().byId("OrderTable");
			var oBinding = oTable.getBinding("items");

			if (sQuery) {
				aFilter.push(new Filter("OrderID", FilterOperator.Contains, sQuery));
			}

			oBinding.filter(aFilter);
		}

	});
});