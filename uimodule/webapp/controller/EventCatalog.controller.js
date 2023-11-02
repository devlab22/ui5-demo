sap.ui.define([ 
	
	'sap/m/Menu', 
	
	'sap/m/MenuItem',

	"opensap/myapp/controller/BaseController"
	
], function (Menu, MenuItem, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.EventCatalog", {

		onInit : function () {
			// call the init function of the parent
			
			/* this.byId("TreeEventCatalog").setContextMenu(new Menu({
					items: [
						new MenuItem({text: "menu 1"})
					]
				})); */
			

			// additional initialization can be done here
				this.loadData()
			
		},
		
		loadData: function(){

			
			console.log("load event catalog")
			var url = "/sap/opu/odata/sap/ZJB_TEST_UI5_SRV"
			var componentsModel = new sap.ui.model.odata.v2.ODataModel(url, true);
			this.setModel(componentsModel, 'eventCatalog' )
			//componentsModel.read("/MainMenuSet");
			console.log(componentsModel)
			
		},

		onCollapseAll: function() {
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.collapseAll();
		},

		onCollapseSelection: function() {
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.collapse(oTreeTable.getSelectedIndices());
		},

		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.expandToLevel(1);
		},

		onExpandSelection: function() {
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		
		onExpandSelectionAll: function() {
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		
		onExpandAll: function(){
			var oTreeTable = this.byId("TreeEventCatalog");
			oTreeTable.expandToLevel(50);
		},
		
		onShowDetailClothing: function(oEvent){
			//var sPath = "clothing>" + oEvent.getSource().getBindingContext("clothing").getPath();
			//console.log(sPath);
			
		},
		
		
		
		
		

	});
});