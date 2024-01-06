var chart_options = {
	series: null,
	chart: {
		width: 720,
		height: 940,
		type: 'scatter',
		zoom: { enabled: false },
		animations: { enabled: false },
		offsetX: 20,
		selection: { enabled: false },
		sparkline: { enabled: false },
	},
	legend: {
		offsetY: 35,
		height: 300,
		show: true,
        showForSingleSeries: true,
	},
	dataLabels: {
	    enabled: true,
        formatter: function (val, opts) {
            return chart_options.series[opts.seriesIndex].name.match(/^(\d+)\./)[1];
        },
	},
	tooltip: {
		enabled: true,
		x: { show: false },
		y: { formatter: function(x, series){ d = chart_data[series.seriesIndex]; return "economic: " + Math.round(d.data[0][0] * 10) / 10 + ", social: " + Math.round(d.data[0][1] * 10) / 10 ; } },
		marker: { show: false },
	},
	grid: {
		padding: {
			right: 40,
			left: 40,
		},
		xaxis: {
			lines: {
				show: true,
			},
		},
		yaxis: {
			lines: {
				show: true,
			},
		},
	},
	xaxis: {
		tickAmount: 20,
		min: -10,
		max: 10,
		labels: { show: false },
	},
	yaxis: {
		tickAmount: 20,
		min: -10,
		max: 10,
		labels: { show: false },
	},
	annotations:{
		yaxis: [
			{
				y: 0,
				y2: 10,
				fillColor: '#ff7575',
				opacity: 0.2,
				width: '50%',
				offsetX: 0,
			},
			{
				y: 0,
				y2: 10,
				fillColor: '#42aaff',
				opacity: 0.2,
				width: '50%',
				offsetX: 316,
			},
			{
				y: -10,
				y2: 0,
				fillColor: '#9aed97',
				opacity: 0.2,
				width: '50%',
				offsetX: 0,
			},
			{
				y: -10,
				y2: 0,
				fillColor: '#c09aec',
				opacity: 0.2,
				width: '50%',
				offsetX: 316,
			},
		],
		points:
		[
			{
				x: 0,
				y: 10,
				marker: { size:0, },
				label: {
				  text: 'Authoritarian',
				  borderWidth: 0,
				  style: { fontSize: '17pt', }
				}
			},
			{
				x: 0,
				y: -11.5,
				marker: { size:0, },
				label: {
				  text: 'Libertarian',
				  borderWidth: 0,
				  style: { fontSize: '17pt', }
				}
			},
		],
		xaxis: [
			{
				x: -10,
				label: {
					text: 'Left',
					borderWidth: 0,
					offsetY: 265,
					style: { fontSize: '17pt', },
				},
			},
			{
				x: 11.5,
				label: {
					text: 'Right',
					borderWidth: 0,
					offsetY: 255,
					style: { fontSize: '17pt', },
				},
			},
		],
	},
};

var colors = [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#3f51b5', '#03a9f4', '#4caf50', '#f9ce1d', '#FF9800',
    '#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B',
    '#4ecdc4', '#c7f464', '#81D4FA', '#546E7A', '#fd6a6a',
    '#2b908f', '#f9a3a4', '#90ee7e', '#fa4443', '#69d2e7',
    '#449DD1', '#F86624', '#EA3546', '#662E9B', '#C5D86D',
    '#D7263D', '#1B998B', '#2E294E', '#F46036', '#E2C044',
    '#662E9B', '#F86624', '#F9C80E', '#EA3546', '#43BCCD',
    '#5C4742', '#A5978B', '#8D5B4C', '#5A2A27', '#C4BBAF',
    '#A300D6', '#7D02EB', '#5653FE', '#2983FF', '#00B1F2',
]

var chart = null;

function activate_chart(){
    chart_options.series = chart_data;

    for(var i=0; i<chart_data.length; i++){
        chart_data[i].index = i;
    }

    chart = new ApexCharts(document.querySelector("#chart"), chart_options);
    chart.render();
    update_chart();
}


function update_chart(){
    data = []

    for(elem of document.querySelectorAll('.modelname')){
	    index = parseInt(elem.id.substr(5));
	    active = elem.classList.contains('active');

	    if(active){
	        data.push(chart_data[index]);
	    }
	}

    if(data.length == 0){
        data = chart_data;
    }

    selected_colors = [];
    for(d of data){
        index = d.index % colors.length;
        selected_colors.push(colors[index]);
    }

    chart_options.colors = selected_colors;
    chart_options.series = data;

    //chart.updateSeries(data);
    chart.updateOptions(chart_options);
}

function toggle(queries, visible=null){
	for(query of queries){
		for(elem of document.querySelectorAll(query)){
			if(visible !== null)
				elem.style.display=visible?'':'none';
			else if(elem.style.display=='none')
				elem.style.display='';
			else
				elem.style.display='none';
		}
	}
	return false;
}

function togglestyle(query, stylename){
	for(elem of document.querySelectorAll(query)){
	    elem.classList.toggle(stylename);
	}
}