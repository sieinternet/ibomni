var variable1 = 0;
var variable2 = 0;


function errh(msg, exc) {
	DWRUtil.byId("loadingImage").style.display="none";
	DWRUtil.byId("timeoutErrorMessage").style.display="block";
}

function submitShowAccountPortofolio() {
	document.getElementById("show_consolidated_account").submit();
}

function inquiry() {
	DWRUtil.byId("loadingImage").style.display="block";
	DWRUtil.byId("detailButton").style.display="none";
	
	var content;
	inquiryConsolidatedView.inquiry(function(data) {
		dwr.util.setValue("generate", data,{ escapeHtml:false });
		inquiryConsolidatedView.getAssetsIdr(function(data) { variable1 = data; });
		inquiryConsolidatedView.getLiabilityIdr(function(data) { variable2 = data; });
		DWRUtil.byId("loadingImage").style.display="none";
	});
	checkContainer();
};

function refresh(){
	DWRUtil.byId("errorMessage").style.display="none";
	DWRUtil.byId("refreshButton").style.display="none";
	inquiry();
}

function refreshTimeout(){
	DWRUtil.byId("timeoutErrorMessage").style.display="none";
	inquiry();
}

function generateDiagram(){
	
	if( $('#visit-chart, #donut-chart').length > 0 ) {
		var data = [
        	{ label: "Assets",  data : variable1},
			{ label: "Liability", data : variable2}
		];
		
		$.plot('#visit-chart, #donut-chart', data, {
			series: {
				pie: {
					show: true,
					innerRadius: .4,
					stroke: {
						width: 4,
						color: "#F9F9F9"
					},
					label: {
						show: true,
						radius: 3/4,
						formatter: donutLabelFormatter
					}
				},
			},
			legend: {
				show: false
			},
			grid: {
				hoverable: true
			},
			colors: [ "#d7ea2b", "#5399D6",  "#d9d9d9"],
		});
	}


	//*******************************************
	/*	CHART AND STAT DEMO PAGE
	/********************************************/

	if( $('#demo-line-chart').length > 0 ) 
		chartYear( $('#demo-line-chart') );
	if( $('#demo-area-chart').length > 0 )
		chartWeek( $('#demo-area-chart') );
	if( $('#demo-vertical-bar-chart').length > 0 )
		chartBarVertical( $('#demo-vertical-bar-chart') );
	if( $('#demo-horizontal-bar-chart').length > 0 )
		chartBarHorizontal( $('#demo-horizontal-bar-chart') );
	if( $('#demo-multi-types-chart').length > 0 )
		chartMonth( $('#demo-multi-types-chart') );

	/* interactive chart demo page */
	if( $('#demo-toggle-series-chart').length > 0 ) {
		chartToggleSeries( $('#demo-toggle-series-chart') );
	}

	if( $('#demo-select-zoom-chart').length > 0 ) {
		chartSelectZoomSeries( $('#demo-select-zoom-chart') );
	}

	/* real-time chart demo */
	if ( $('#demo-real-time-chart').length > 0  ) {
		chartRealtTime($('#demo-real-time-chart'), "bar");
	}

	/* javascript helper functions */
	function showTooltip(x, y, contents) {

		$("<div id='tooltip' class='flot-tooltip'>" + contents + "</div>").css({
			top: y + 5,
			left: x + 5,
		}).appendTo("body").fadeIn(200);
	}

	// get day function
	function gt(y, m, d) {
		return new Date(y, m-1, d).getTime();
	}

	function donutLabelFormatter(label, series) {
		return "<div class=\"donut-label\">" + label + "<br/>" + Math.round(series.percent) + "%</div>";
	}

	function randomVal(){
			return Math.floor( Math.random() * 80 );
	}
}

function checkContainer () {
	if($('#consAcc').is(':visible')){
		if((variable1 != 0)){
			generateDiagram();  
			DWRUtil.byId("detailButton").style.display="block";
		}else {
	    	setTimeout(checkContainer, 50);
		}
	} else {
    	setTimeout(checkContainer, 50);
    	
	}
}