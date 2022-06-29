sap.ui.define(

		[

			"sap/ui/model/Filter",

			"sap/ui/model/FilterOperator",

			"opensap/myapp/controller/OrderDetailsDialog.controller",

			"opensap/myapp/controller/BaseController"

		], function (Filter, FilterOperator, OrderDetailsDialog, BaseController) {

		return BaseController.extend("opensap.myapp.controller.NorthwindTable", {

			orderDetailsDialog: OrderDetailsDialog,

			_mFilters: {
				All: [],
				Ok: [new Filter("Freight", "LT", 5)],
				Heavy: [new Filter("Freight", "BT", 5, 50)],
				Overweight: [new Filter("Freight", "GT", 50)]
			},

			_oParameters: {},

			onInit: function(){
				//console.log("init Order Table");

			},

			onUpdateFinishedOrderTable: function(oEvent){
				console.log("onUpdateFinishedOrderTableExt");

				var oOrderTable = this.byId("OrderTable");
				var oModel      = oOrderTable.getBinding("items").getModel();
				var oBinding    = oOrderTable.getBinding("items");
				var sPathOrder  = oBinding.getPath();
				sPathOrder = sPathOrder + "/$count";

				var oTabData = {};
				oTabData["All"] = this.byId("All");
				oTabData["Ok"] = this.byId("Ok");
				oTabData["Heavy"] = this.byId("Heavy");
				oTabData["Overweight"] = this.byId("Overweight");
				//console.log(oTabData);

				jQuery.each(this._mFilters, function (sKey, oFilter){
					oModel.read(sPathOrder, {
						filters: oFilter,
						success: function(oData){
							var sPath = "/" + sKey;
							//console.log("id: ", sKey );
							//console.log("count: ", oData);
							var oTab = oTabData[sKey];
							if (oTab){
								oTab.setProperty("count", oData);
							};

						}
					});
				});
			},

			onFilterSelectOrder: function(oEvent){

				var sKey = oEvent.getParameter("key");
				console.log(sKey);

				var oFilter = this._mFilters[sKey];
				var oBinding = this.byId("OrderTable").getBinding("items");
				if (oBinding){
					oBinding.filter(oFilter);
				}
			},

			setOrderTable: function(oTableOrder, oPanel, oTitle, oPanelDetails, oParams){

				//console.log(oParams);

				this._oParameters[oParams["viewid"]] = oParams;

				if (oPanel){
					oPanel.bindElement(oParams["context"]);
				    oPanel.bindProperty("headerText", "northwind>CompanyName");
				}

				if (oTitle){
					oTitle.bindElement(oParams["context"]);
					oTitle.bindProperty("text", "northwind>CompanyName");
				}

				if (oParams["selectionChange"].length == 0){
					oTableOrder.setProperty("mode", "None");
				}

				var sPath = oParams["context"] + "/Orders";

				var oTemplate = new sap.m.ColumnListItem({
    						cells: [
        					new sap.m.ObjectIdentifier({
            						title: "{northwind>OrderID}"
        						}),
        					new sap.m.ObjectNumber({
            						number: "{northwind>EmployeeID}"
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
        						}),
        					new sap.m.ObjectNumber({
            						number: "{ path: 'northwind>Freight', type: 'sap.ui.model.type.Float', formatOptions: {maxFractionDigits: 2} }",
									unit: "kg"
        						}),
							new sap.m.Text({
            						text: "{northwind>CustomerID}",
									wrapping: false
        						})
    							]
						});

				oTableOrder.bindItems(sPath, oTemplate, null, null);

				if (oPanelDetails){
					oPanelDetails.setProperty("visible", false);
				}

			},

			onOrderPress: function(oEvent){
				console.log("onOrderPress");
				console.log(this.getView().getParent().sId);
				console.log(this._oParameters);
				this.onSelectOrder(oEvent);
			},
			onOrderPressDialog: function(oEvent){
				console.log("event onOrderPress Dialog");

			},
			onSelectOrder: function(oEvent){
				console.log("event onSelectOrder");

				var sViewId = "ordersDetailsTable";
				var oTableOrder = this.byId(sViewId).byId("orderTableDetails");
				console.log(oTableOrder);
				//var oTitle = this.byId(sViewId).byId("OrderTitleDetails");
				var oPanel = this.byId(sViewId).byId("panelOrderDetails");

				var sContext = this.byId("OrderTable").getSelectedContexts(true)[0].sPath;
				sContext = "northwind>" + sContext;

				var controller = new this.orderDetailsDialog();
				controller.setOrderTable(oTableOrder, sContext, null, null, sViewId, null);

				var oPanel = this.byId("orderDetailsPanel");
				oPanel.setProperty("visible", true);
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