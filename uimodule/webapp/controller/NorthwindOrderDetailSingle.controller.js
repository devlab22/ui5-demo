sap.ui.define(

		[
			
			"sap/ui/model/Filter",
			
			"sap/ui/model/FilterOperator",

			"opensap/myapp/controller/BaseController"
			

		], function (Filter, FilterOperator, BaseController) {
			
			

		return BaseController.extend("opensap.myapp.controller.NorthwindOrderDetailSingle", {			
			
			_mFilters: {
				All: [],
				Ok: [new Filter("UnitPrice", "LT", 5)],
				Heavy: [new Filter("UnitPrice", "BT", 5, 50)],
				Overweight: [new Filter("UnitPrice", "GT", 50)]
			},
			

			onInit : function(){
				
				console.log("init Order Details");
				
				
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.getRoute("northwindOrderDetails").attachPatternMatched(this._onObjectMatched, this);
			},
			
			_onObjectMatched: function (oEvent) {
				var sPath = window.decodeURIComponent(oEvent.getParameter("arguments").OrderPath);
				console.log(sPath);
			
			/*
			this.getView().bindElement({
				path: sPath,
				model: "northwind"
			});	
			*/
			   
				var oParams = {
					"context": sPath
				};
				this.setOrderTable(oParams);
			
			},
						
			onUpdateFinishedOrderTableDetails: function(oEvent){
				console.log("onUpdateFinishedOrderTableExt");
				
				var oOrderTable = this.byId("orderTableDetails");
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
							if(oTab){
								oTab.setProperty("count", oData);
							};
														
						}
					});
				});
			},
			
			onFilterSelectOrderDetails: function(oEvent){
				
				var sKey = oEvent.getParameter("key");
				console.log(sKey);
				
				var oFilter = this._mFilters[sKey];
				var oBinding = this.byId("orderTableDetails").getBinding("items");
				if(oBinding){
					oBinding.filter(oFilter);
				}
			},
			
			setOrderTable: function(oParams){
				
				var sContext = oParams["context"];
				console.log(sContext);
				
				if(oParams["panel"] == true){
					var oPanel = this.byId("panelOrderDetails");
					oPanel.bindElement(sContext);
				    oPanel.bindProperty("headerText", "northwind>OrderID");
				}
				
				if(oParams["title"] == true){
					var oTitle = this.byId("OrderTitleDetails");
					oTitle.bindElement(sContext);
					oTitle.bindProperty("text", "northwind>OrderID");
				}			
								
				var sPath = sContext + "/Order_Details"; 
				
				var oTemplate = new sap.m.ColumnListItem({
    						cells : [
        					new sap.m.ObjectIdentifier({
            						title : "{northwind>OrderID}"          						 
        						}),
        					new sap.m.ObjectNumber({
            						number : "{northwind>ProductID}"        						
        						}),
								
       						new sap.m.ObjectNumber({
									number: { 
										parts: [ 
											{path: 'northwind>UnitPrice'}, 
											{path: 'northwindModel>/currency'} 
												],
										type: 'sap.ui.model.type.Currency'
										    },
									state: sap.ui.core.ValueState.Success
       							 }),
        					new sap.m.ObjectNumber({
								    number : "{northwind>Quantity}"
        						}), 
        					new sap.m.ObjectNumber({
								     number : { 
										path: 'northwind>Discount', 
										formatter: this.formatter.getDiscountValueStr  
												}									 						 
        						}), 
        					new sap.m.ObjectNumber({
								     number : {
										parts: [
											{ path: 'northwind>UnitPrice'},
											{ path: 'northwind>Quantity'},
											{ path: 'northwindModel>/currency'}
												],
										formatter: this.formatter.calculatePrice
											},
									 state: sap.ui.core.ValueState.Success
        						})

    							]
						});

				var oTable = this.byId("orderTableDetails");
				oTable.bindItems(sPath, oTemplate, null, null);
			}


	});

});