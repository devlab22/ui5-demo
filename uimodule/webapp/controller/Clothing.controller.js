sap.ui.define([ 
	
	'sap/m/Menu', 
	
	'sap/m/MenuItem',

	"opensap/myapp/controller/BaseController"
	
], function (Menu, MenuItem, BaseController) {
	"use strict";

	return BaseController.extend("opensap.myapp.controller.Clothing", {

		

		onInit : function () {
			// call the init function of the parent
			
			this.byId("TreeTableBasic").setContextMenu(new Menu({
					items: [
						new MenuItem({text: "{text}"})
					]
				}));
			

			// additional initialization can be done here
		},
		
		onCollapseAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},

		onCollapseSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapse(oTreeTable.getSelectedIndices());
		},

		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(1);
		},

		onExpandSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		
		onExpandSelectionAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		
		onExpandAll: function(){
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(50);
		},
		
		onShowDetailClothing: function(oEvent){
			var sPath = "clothing>" + oEvent.getSource().getBindingContext("clothing").getPath();
			console.log(sPath);
			
		},
		
		onAddClothing: function(oEvent){
			console.log("onAddClothing");
			
			var oTreeTable = this.byId("TreeTableBasic");
			var idx = -1;
			if(oTreeTable.getSelectedIndices().length > 0){
				idx = oTreeTable.getSelectedIndices()[0];
			}
			
			console.log(idx);			
			var sPath = "";
			if(idx >= 0){
				sPath = "clothing>" + oTreeTable.getContextByIndex(idx).getPath();
			}else{
				sPath = "clothing>" + oTreeTable.getBinding("rows").getPath();
			}
			
			console.log(sPath);
			console.log(window.encodeURIComponent(sPath));
			sPath = window.encodeURIComponent(sPath);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("addClothing",{
					ClothingPath: sPath
				});
			
		},
		
		onDragStart : function (oEvent) {
			console.log("onDragStart");
			console.log(oEvent);
			var oTree = this.byId("TreeTableBasic");
			var oBinding = oTree.getBinding("rows");
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedItem = oEvent.getParameter("target");
			console.log("drag item");
			console.log(oDraggedItem);
			var sPath = oDraggedItem.getBindingContext("clothing").getPath();
			console.log(sPath);
			var iDraggedItemIndex = oTree.getSelectedIndices();
			var aSelectedIndices = oTree.getBinding("rows").getSelectedIndices();
			var aSelectedItems = oTree.getSelectedIndices();
			var aDraggedItemContexts = [];

			if (aSelectedItems.length > 0) {
				// If items are selected, do not allow to start dragging from a item which is not selected.
				if (aSelectedIndices.indexOf(iDraggedItemIndex) === -1) {
					oEvent.preventDefault();
				} else {
					for (var i = 0; i < aSelectedItems.length; i++) {
						aDraggedItemContexts.push(oBinding.getContextByIndex(aSelectedIndices[i]));
					}
				}
			} else {
				aDraggedItemContexts.push(oBinding.getContextByIndex(iDraggedItemIndex));
			}

			oDragSession.setComplexData("hierarchymaintenance", {
				draggedItemContexts: aDraggedItemContexts
			});
		},
		
		onDrop: function (oEvent) {
			console.log("onDrop");
			var oTree = this.byId("TreeTableBasic");
			var oBinding = oTree.getBinding("rows");
			var oDragSession = oEvent.getParameter("dragSession");
			var oDroppedItem = oEvent.getParameter("droppedControl");
			var aDraggedItemContexts = oDragSession.getComplexData("hierarchymaintenance").draggedItemContexts;
			var iDroppedIndex = oTree.getSelectedIndices();
			var oNewParentContext = oBinding.getContextByIndex(iDroppedIndex);

			if (aDraggedItemContexts.length === 0 || !oNewParentContext) {
				return;
			}

			var oModel = oTree.getBinding("rows").getModel();
			var oNewParent = oNewParentContext.getProperty();

			// In the JSON data of this example the children of a node are inside an array with the name "categories".
			if (!oNewParent.categories) {
				oNewParent.categories = []; // Initialize the children array.
			}

			for (var i = 0; i < aDraggedItemContexts.length; i++) {
				if (oNewParentContext.getPath().indexOf(aDraggedItemContexts[i].getPath()) === 0) {
					// Avoid moving a node into one of its child nodes.
					continue;
				}

				// Copy the data to the new parent.
				oNewParent.categories.push(aDraggedItemContexts[i].getProperty());

				// Remove the data. The property is simply set to undefined to preserve the tree state (expand/collapse states of nodes).
				oModel.setProperty(aDraggedItemContexts[i].getPath(), undefined, aDraggedItemContexts[i], true);
			}
		}

	});
});