sap.ui.define([], function(){
	"use strict";
	// global data
	var aCountry = [];
	var bDebug = false;
	var userLanguage = window.navigator.userLanguage || window.navigator.language;

	window.fetch("https://restcountries.com/v2/all")
				 .then(response => response.json())
				 .then( function(json) { 
					
						aCountry = json;
						//console.log(aCountry)
					}
				 )
				 .catch(function(){console.log("error")});
				
	
	return {
		delivery: function(iWeight, sMeasure){
			var sResult = "";
			sMeasure = sMeasure.toUpperCase();
			
			if(sMeasure === "G"){
				iWeight = iWeight / 1000;
			}else if (sMeasure === "T"){
				iWeight = iWeight * 1000;
			}
			
			if(iWeight <= 0){
				sResult = "No Delivery";
			}else if(iWeight < 0.5){
				sResult = "Mail Delivery";
			} else if (iWeight < 5){
				sResult = "Parcel Delivery";
			}else{
				sResult = "Carrier Delivery";
			}
			
			return sResult;
		},
		
		getCountryCount: function(){
			return aCountry.length;
		},
		getCountryState : function(sCountry){
			var sResult = "None";

			if(sCountry === "Germany"){
				sResult = "Success";
			}
			
			return sResult;
		},
		
		getBmiIndex: function(height, heightUnit, weight, weightUnit){
			heightUnit = heightUnit.toUpperCase();
			
			if(heightUnit == "CM"){
				height /= 100; 
			}

		//bmi = Koerpergewicht in kg / (Koerpergrosser in m) ^2
			var bmi = weight / (Math.pow(height, 2)); 
			bmi = round(bmi, 2);
			return  bmi;
		},
		
		round: function (value, decimals) {
			  return  Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		},
		
		getBmiValue: function(height, heightUnit, weight, weightUnit) {
			
			var sResult = "";
			
			var bmi = this.getBmiIndex(height, heightUnit, weight, weightUnit);
			
			if(bmi <= 18.5){
				sResult = "Untergewicht";
			}
			else if (bmi > 18.5 && bmi <= 25){
				sResult = "Normalgewicht";
			}
			else if (bmi > 25 && bmi <= 30){
				sResult = "Ubergewicht";
			}
			else{
				sResult = "Adipositas";
			}
			
			return sResult;
		},
		
		getBMI: function(iHeight, sHeightUnit, iWeight, sWeightUnit){
			
			var oResult = {};
			var sValue = "";
			
			iHeight = parseFloat(iHeight.replace(",", "."));
			iWeight = parseFloat(iWeight.replace(",", "."));
			
			sHeightUnit = sHeightUnit.toUpperCase();
			
			if(sHeightUnit == "CM"){
				iHeight /= 100; 
			}

		//bmi = Koerpergewicht in kg / (Koerpergrosser in m) ^2
			var iBmi = iWeight / (Math.pow(iHeight, 2)); 
			iBmi = this.round(iBmi, 2);
			oResult.index = iBmi;
			
			if(iBmi <= 18.5){
				sValue = "Untergewicht";
			}
			else if (iBmi > 18.5 && iBmi <= 25){
				sValue = "Normalgewicht";
			}
			else if (iBmi > 25 && iBmi <= 30){
				sValue = "Ubergewicht";
			}
			else{
				sValue = "Adipositas";
			}
			
			oResult.descr = sValue;
			return oResult;
		},
		
		getCountryCode: function(sCountry){
			
			var sCode = "unknown";
			//console.log(sCountry);
			
			for(let i=0; i < aCountry.length; i++) {
						
						if(aCountry[i]["name"] === sCountry){
							//console.log(aCountry[i]);
							sCode = aCountry[i]["alpha2Code"];
							return sCode;
						}
			}
			
			return sCode;			
		},
			
		getCountryCodeDuo: function(sCountry){
			
			//var sCode = this.getCountryCode(sCountry);
			return sCountry;
		},
		
		calculatePrice: function( sPrice, sQuantity, sCurrency ){
			
			if(bDebug){
				console.log("calculatePrice formatter");
				console.log("price:", sPrice);
				console.log("quantity:", sQuantity);
				console.log("userLangu:", userLanguage);
			}			
			
			
			var formatter = new Intl.NumberFormat(userLanguage, {
					style: 'currency',
					currency: sCurrency,
					currencyDisplay: 'code'
				
			});
			var sPreis = parseFloat(sPrice);
			var sCount = parseFloat(sQuantity);
			var sResult = sPreis * sCount;
			return formatter.format(sResult);
		},

		calculatePriceWoCurrency: function( sPrice, sQuantity, sCurrency ){
			
			if(bDebug){
				console.log("calculatePriceWoCurrency formatter");
				console.log("price:", sPrice);
				console.log("quantity:", sQuantity);
				console.log("userLangu:", userLanguage);
			}			
			
			
			var formatter = new Intl.NumberFormat(userLanguage, {
					style: 'currency',
					currency: sCurrency,
					currencyDisplay: 'code'
				
			});
			var sPreis = parseFloat(sPrice);
			var sCount = parseFloat(sQuantity);
			var sResult = sPreis * sCount;
			return formatter.format(sResult).slice(0,-4);
		},
		
		getDiscountValue: function(sDiscount){
			if(bDebug){
				console.log("getDiscountValue");
				console.log(sDiscount);
			}
			
			var fDiscount = parseFloat(sDiscount);
			return fDiscount * 100;
		},

		getDiscountValueStr: function(sDiscount){
			if(bDebug){
				console.log("getDiscountValue");
				console.log(sDiscount);
			}

			var formatter = new Intl.NumberFormat(userLanguage, {
				style: 'percent'
			});
			
			var fDiscount = parseFloat(sDiscount);
			return formatter.format(fDiscount);
		},
		
		getPopulationState: function( sPopulation ){
			var iPopulation = parseInt(sPopulation,10);
			
			var sState = 'None';
			
			if(iPopulation > 200000000){
				sState = "Error";
			}else if(iPopulation > 100000000){
				sState = "Warning";
			}else{
				sState = "Information";
			}
			
			return sState;
		},
		
		getAreaState: function( sArea ){
			var iArea = parseFloat(sArea);
			
			var sState = 'None';
			
			if(iArea > 200000000){
				sState = "Error";
			}else if(iArea > 100000000){
				sState = "Warning";
			}else{
				sState = "Information";
			}
			
			return sState;
		},
		
		getNumberExt: function(sNumber){			
			return new Intl.NumberFormat(userLanguage).format(sNumber);
		},

		getFreightState: function(sValue){
			// "{= ${northwind>Freight} > 10 ? 'Error' : 'Success'}",
			var freight = parseFloat(sValue);
			var sResult = "Success";

			if(freight >= 5 && freight <= 10){
				sResult = "Information";				
			}else if(freight >= 10 && freight <= 20){
				sResult = "Warning";
			}else if(freight > 20){
				sResult = "Error";
			}

			return sResult;
		},

		getFreightStatus: function(sValue){
			// "{= ${northwind>Freight} > 10 ? 'Error' : 'Success'}",
			var freight = parseFloat(sValue);
			var sResult = "Ok";

			if(freight >= 5 && freight <= 10){
				sResult = "Normally";
			}else if(freight >= 10 && freight <= 20){
				sResult = "Heavy";
			}else if(freight > 20){
				sResult = "Overweight";
			}

			return sResult;
		},

		getPriceState: function(sValue){
			// "{= ${northwind>Price} > 50 ? 'Error' : 'Success'}",
			var freight = parseFloat(sValue);
			var sResult = "Success";

			if(freight >= 5 && freight <= 50){
				sResult = "Information";				
			}else if(freight > 50){
				sResult = "Error";
			}

			return sResult;
		},

		getPriceStatus: function(sValue){
			// "{= ${northwind>Price} > 50 ? 'Error' : 'Success'}",
			var freight = parseFloat(sValue);
			var sResult = "Cheap";

			if(freight >= 5 && freight <= 50){
				sResult = "Ok";				
			}else if(freight > 50){
				sResult = "Expensive";
			}

			return sResult;
		}


		
		
	};
});