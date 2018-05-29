import { Chart as ChartJs } from 'chart.js';

export class Chart {

	//variable chart
	grafikChart;
	dataChart = [];
	labelChart = [];

	constructor() { }

	//inisialisasi option grafik
	init(canvas, label) {
	  this.grafikChart = new ChartJs(canvas, {
	      type: 'line',
	      data: {labels: this.labelChart,
	              datasets: [{ 
	                data: this.dataChart,
	                label: label,
	                borderColor: "#3e95cd",
	                fill: false
	              }]
	            },
	      options: {
	        layout: {
	          padding: {
	              left: 10,
	              right: 0,
	              top: 0,
	              bottom: 0
	          }
	        }
	      }
      });
	}

	//tambah data
	addDataChart(valueChart, labelChart) {

		this.labelChart.push(labelChart);
        this.dataChart.push(valueChart);

        if (this.labelChart.length > 5) {
          this.labelChart.shift();
          this.dataChart.shift();
        }

        this.grafikChart.update();
	}
}
