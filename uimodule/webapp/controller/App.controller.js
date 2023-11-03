/* eslint-disable no-unused-vars */
sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"opensap/myapp/controller/NorthwindTable.controller",
	"opensap/myapp/controller/BaseController",
	"opensap/myapp/model/formatter"
], function (MessageToast, Filter, FilterOperator, JSONModel,
	northwindTableController, BaseController, formatter) {

	return BaseController.extend("opensap.myapp.controller.App", {
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
		northwindTableController: northwindTableController,

		_mFilters: {
			All: [],
			Ok: [new Filter("Freight", "LT", 5)],
			Heavy: [new Filter("Freight", "BT", 5, 50)],
			Overweight: [new Filter("Freight", "GT", 50)]
		},

		_mFiltersPrice: {
			All: [],
			Ok: [new Filter("UnitPrice", "LT", 5)],
			Heavy: [new Filter("UnitPrice", "BT", 5, 50)],
			Overweight: [new Filter("UnitPrice", "GT", 50)]
		},

		_mFiltersCustomer: {
			count: []
		},

		_mFiltersCountry: {
			count: []
		},

		onInit: function () {
			console.log("init");

			this.loadCountryModel();

			this.loadNorthwindModel();

			this.loadUserDataModel();

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			console.log("end of init");
		},

		loadUserDataModel: function () {


			// sap userData
			var url = "";
			//url = this.getUrl("/sap/opu/odata/sap/ZVE_USERUI5_SRV/");
			url = "/sap/opu/odata/sap/ZVE_USERUI5_SRV";
			var oModelUser = new sap.ui.model.odata.v2.ODataModel(url, true);

			oModelUser.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

			this.setModel(oModelUser, "users");
			console.log("model users");
			console.log(oModelUser);

			oModelUser.read("/UserDataSet/$count", {
				success: (count) => {
					this.setIconTabProperties({view: this.getView(), tabId: "userDataControl", count: count});
				}
			});


			/*
			console.log("componentsModel")
			url = "/sap/opu/odata/sap/ZJB_TEST_UI5_SRV"
			var componentsModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			componentsModel.read("/ComponentsSet");
			console.log(componentsModel)
			*/
		},

		loadCountryModel: function () {

			//country
			console.log("country model");
			var oModelCountry = new JSONModel("https://restcountries.com/v3.1/all");
			this.setModel(oModelCountry, "country");
			console.log(oModelCountry);
		},

		loadNorthwindModel: function () {

			var url = "";

			//url = "https://services.odata.org/V2/Northwind/Northwind.svc/";
			//url = "https://cors.bridged.cc/https://services.odata.org/V2/Northwind/Northwind.svc/";
			url = "http://localhost:8081/https://services.odata.org/V2/Northwind/Northwind.svc/";


			var oModelNorthwind = new sap.ui.model.odata.v2.ODataModel(url, true);

			this.setModel(oModelNorthwind, "northwind");
			console.log("northwind");
			console.log(oModelNorthwind);

			// northwind
			var oNorthwindModel = new JSONModel({
				count: 0,
				currency: "EUR",
				countCountry: this.formatter.getCountryCount()
			});

			var sPath = "/Customers/$count";

			jQuery.each(this._mFiltersCustomer, function (sKey, oFilter) {
				oModelNorthwind.read(sPath, {
					filters: oFilter,
					success: function (oData) {
						var sPath1 = "/" + sKey;
						oNorthwindModel.setProperty(sPath1, oData);
					}
				});
			});

			this.setModel(oNorthwindModel, "northwindModel");
			console.log(oNorthwindModel);
		},

		onUpdateFinishedCustomerTable: function (oEvent) {

			console.log("onUpdateFinished Customers table");
			//console.log(oEvent);
			var oTable = this.byId("CompanyTable");
			var oBinding = oTable.getBinding("items");
			var oModel = oBinding.getModel();

			var sPath = oBinding.getPath() + "/$count";
			//console.log(sPath);
			var oTab = this.byId("northwindTab");

			jQuery.each(this._mFiltersCustomer, function (sKey, oFilter) {
				oModel.read(sPath, {
					filters: oFilter,
					success: function (oData) {
						oTab.setProperty("count", oData);
					}
				});
			});

		},

		onUpdateFinishedCustomerList: function (oEvent) {

			console.log("onUpdateFinished Customers List");

			var oList = this.byId("CustomerList");
			var oBinding = oList.getBinding("items");
			var oModel = oBinding.getModel();

			var sPath = oBinding.getPath() + "/$count";
			var oTab = this.byId("northwindList");

			oModel.read(sPath, {
				success: function (oData) {
					oTab.setProperty("count", oData);
				}
			});

		},

		onShowHello: function () {

			console.log("say hello");

			// read msg from i18n model

			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var sRecipient = this.getView().getModel("helloPanel").getProperty("/recipient/name");

			var sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message

			MessageToast.show(sMsg);

		},

		onSelectBar: function (oEvent) {
			//console.log("select");
			//console.log(oEvent);
		},
		onExpandBar: function (oEvent) {
			console.log("expand");
			console.log(oEvent);
		},
		onCompanyPress: function (oEvent) {
			console.log("select company intern");


			let oTableOrder = this.byId("OrderTable");
			let oTitle = this.byId("OrderTitle");


			let context = this.byId("CompanyTable").getSelectedContexts(true)[0].sPath;

			oTitle.bindElement("northwind>" + context);
			oTitle.bindProperty("text", "northwind>CompanyName");

			//console.log(this.byId("CompanyTable"));

			var sPath = "northwind>" + context + "/Orders";
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
						number: "{northwind>Freight}",
						unit: "kg"
					}),
					new sap.m.Text({
						text: "{northwind>CustomerID}",
						wrapping: false
					})
				]
			});

			oTableOrder.bindItems(sPath, oTemplate, null, null);

			var oPanel = this.byId("OrderTab");
			oPanel.setProperty("visible", true);
			//console.log(context);
		},

		getUrl: function (sUrl) {
			if (sUrl == "")
				return sUrl;
			if (window.location.hostname == "localhost") {
				return "proxy" + sUrl;
			} else {
				return sUrl;
			}

		},
		onCalculate: function () {

			var iWeight = this.byId("idWeight").getValue();
			var iWeightUnit = this.byId("idWeightUnit").getValue();

			var sResult = formatter.delivery(iWeight, iWeightUnit);
			this.byId("idResult").setValue(sResult);
			//MessageToast.show(sResult);
			console.log(sResult);

		},

		onCalculateForm: function () {
			console.log("onCalcForm");
			var iWeight = this.byId("idWeightForm").getValue();
			var iWeightUnit = this.byId("idWeightUnitForm").getSelectedItem().getProperty("text");

			var sResult = formatter.delivery(iWeight, iWeightUnit);
			this.byId("idResultForm").setValue(sResult);
		},
		OnSearchCompanyList: function (oEvent) {
			console.log("search company list");

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			var oList = this.getView().byId("CustomerList");
			var oBinding = oList.getBinding("items");

			if (sQuery) {
				aFilter.push(new Filter("CompanyName", FilterOperator.Contains, sQuery));
				//aFilter.push(new Filter("CustomerID", FilterOperator.Contains, sQuery));
			}

			oBinding.filter(aFilter);
		},
		onSearchCompany: function (oEvent) {
			console.log("search company table");

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			var oTable = this.getView().byId("CompanyTable");
			var oBinding = oTable.getBinding("items");

			if (sQuery) {
				aFilter.push(new Filter("CompanyName", FilterOperator.Contains, sQuery));
				//aFilter.push(new Filter("CustomerID", FilterOperator.Contains, sQuery));
			}

			oBinding.filter(aFilter);
		},
		OnCompanyItemPress: function (oEvent) {
			console.log("company item pressed");
			var sPath = "northwind>" + oEvent.getSource().getBindingContext("northwind").getPath();
			console.log(sPath);

			var sTarget = "northwindOrdersList";

			this.navTo(sTarget, {
				CustomerPath: window.encodeURIComponent(sPath)
			});
			return;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(sTarget, {
				CustomerPath: window.encodeURIComponent(sPath)
			});

			return;
			var sParent = this.byId("CustomerList").getParent().sId;

			var oParams = {
				"selectionChange": "onSelectOrder",
				"parent": sParent,
				"context": sPath,
				"viewid": "ordersTableList"
			};

			var oPanel = this.byId("customerOrderPanel");
			this.setOrderTable(oParams);
			oPanel.setVisible(true);
		},

		onCalculateBMI: function (oEvent) {

			var fHeight = this.byId("idHeightBmi").getValue();
			var fWeight = this.byId("idWeightBmi").getValue();
			console.log("bmi");
			console.log(fHeight, fWeight);

			var oResult = formatter.getBMI(fHeight, "m", fWeight, "kg");
			//console.log(oResult);

			this.byId("idBmiIndex").setText("index: " + oResult.index);
			this.byId("idBmiDescr").setText(oResult.descr);
		},

		setTabFilterCount: function (sKey, sCount) {
			this.byId(sKey).setProperty("count", sCount);
		},

		OnCompanySplitItemPress: function (oEvent) {
			console.log("OnCompanySplitItemPress");

			var item = sap.ui.getCore().byId(oEvent.getSource().sId);
			if (!item) {
				return;
			}
			var context = item.getBinding("title").getContext().sPath;

			context = "northwind>" + context;


			console.log(context);
			var oForm = this.byId("SimpleFormCust");
			oForm.bindElement(context);

			var oContact = this.byId("SimpleContactCust");
			oContact.bindElement(context);

			var oCustomerList = this.byId("detailCustomerList");
			oCustomerList.bindElement(context);

			var oPanel = this.byId("idDetailsOrderPanel");
			if (oPanel) {
				oPanel.bindElement(context);
				//oPanel.bindProperty("headerText", "northwind>CompanyName");
			}

			var oParams = {
				"selectionChange": "onSelectOrder",
				"parent": null,
				"context": context,
				"viewid": "ordersTableSplit"
			};

			this.byId("rating").reset();
			this.setOrderTable(oParams);

		},

		onUpdateFinishedCountryTable: function (oEvent) {

			console.log("onUpdateFinishedCountryTable");

			var sCount = oEvent.getParameter("total");
			//console.log(sCount);
			this.setTabFilterCount("countryFilter", sCount);
		},

		onSearchCountry: function (oEvent) {
			console.log("search country");

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			var oTable = this.getView().byId("CountryTable");
			var oBinding = oTable.getBinding("items");
			console.log(sQuery);

			if (sQuery) {
				aFilter.push(new Filter("name/common", FilterOperator.Contains, sQuery));
			}

			oBinding.filter(aFilter);
		},

		onUpdateFinishedCustomerSplitList: function (oEvent) {

			console.log("onUpdateFinishedCustomerSplitList");

			var oList = this.byId("CustomerSplitList");
			var oBinding = oList.getBinding("items");
			var oModel = oBinding.getModel();

			var sPath = oBinding.getPath() + "/$count";
			var oTab = this.byId("northwindSplitList");

			oModel.read(sPath, {
				success: function (oData) {
					//console.log("model oData");
					//console.log(oData);
					oTab.setProperty("count", oData);
				}
			});
		},

		onPressNavToDetail: function (oEvent) {
			console.log("onPressNavToDetail");
			this.getSplitAppObj().to(this.createId("detailsOrderPage"));
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},

		onPressDetailBack: function (oEvent) {
			console.log("onPressDetailBack");
			this.getSplitAppObj().backDetail();
		},

		getDiscountValue: function (sDiscount) {
			console.log("getDiscountValue controller");
			return sDiscount + "cont";
		},

		onCompanyPressExt: function (oEvent) {
			console.log("select company ext");

			var sPath = "northwind>" + oEvent.getSource().getSelectedContexts(true)[0].getPath();
			console.log(sPath);

			this.navTo("northwindOrders", {
				CustomerPath: window.encodeURIComponent(sPath)
			});
			return;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("northwindOrders", {
				CustomerPath: window.encodeURIComponent(sPath)
			});

			return;
			var sParent = this.byId("CompanyTable").getParent().sId;
			console.log("parent", sParent);
			var context = this.byId("CompanyTable").getSelectedContexts(true)[0].sPath;
			var oPanel = this.byId("OrderTab");
			context = "northwind>" + context;

			var oParams = {
				"viewid": "ordersTable",
				"selectionChange": "onSelectOrder",
				"parent": sParent,
				"context": context
			};
			this.setOrderTable(oParams);

			oPanel.setProperty("visible", true);
		},

		setOrderTable: function (oParams) {

			var oTableOrder = this.byId(oParams["viewid"]).byId("OrderTable");
			var oTitle = this.byId(oParams["viewid"]).byId("OrderTitle");
			var oPanel = this.byId(oParams["viewid"]).byId("panelOrder");
			var oPanelDetails = this.byId(oParams["viewid"]).byId("orderDetailsPanel");


			var controller = new this.northwindTableController();
			controller.setOrderTable(oTableOrder, oPanel, oTitle, oPanelDetails, oParams);

		},

		onShowDetailCountry: function (oEvent) {
			console.log("onShowDetailCountry");
			var sPath = "country>" + oEvent.getSource().getBindingContext("country").getPath();
			console.log(sPath);

			//return;
			//var oPopover = this.byId("countryPopover");
			var oPopover = this._getPopover();
			oPopover.bindElement(sPath);
			var oOpener = oEvent.getParameter("domRef");
			oPopover.openBy(oOpener);

		},

		_getPopover: function () {
			if (!this._oCountryPopover) {
				this._oCountryPopover = sap.ui.xmlfragment("opensap.myapp.view.CountryDetails", this);
				this.getView().addDependent(this._oCountryPopover);
			}

			return this._oCountryPopover;
		},

		onRatingChange: function (oEvent) {
			console.log("onRatingChange");
			var iValue = "Rating: " + oEvent.getParameter("value");
			console.log(iValue);
			MessageToast.show(iValue);
			this.byId("rating").setEnabled(true);
		},

		onCountryPress: function (oEvent){

			var sIndex = oEvent.getSource().getSelectedContexts(true)[0].getPath();
			var iIndex = sIndex.slice(1);
			var sModel = this.getModel("country");
			var oData = sModel.getData()[iIndex];
			console.log(oData.maps.googleMaps);



		}


	});

});