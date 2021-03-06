"use strict"

class Chart{
	constructor(mathbox, options){
		this.mathbox = mathbox
		this.x = options.x
		this.y = options.y
		this.z_offset = options.z_offset
		this.id = options.id
		this.xRange = options.xRange
		this.yRange = options.yRange
		this.zRrange = options.zRrange
		this.scale = options.scale
		this.color = options.color
		this.colors = options.colors

		this.chart = null

		this.init()
	}

	init(){
		// debugger
		this.z = this.x.map(()=>{return this.z_offset})

		var data = _.zip(this.x, this.y, this.z)
		var view = this.mathbox.cartesian({
		  range: [this.xRange, this.yRange, this.zRrange],
		  scale: this.scale
		});


		// draw line
		view.array({
		  id: this.id,
		  width: numData,
		  data: data,
		  items: 1,
		  channels: 3,
		  live: false
		}).line({
			id: this.id+'-line',
			color: this.color,
			colors: this.colors,
			width: 10
		})

		this.chart =this.mathbox.select("#"+this.id)

		// draw XY grid
		view.transform({position:[0, 0, this.z_offset]})
		.grid({
			axes: "xy",
			divideX: 4,
			divideY: 4,
			niceY: false,
			width: 1,
			opacity: 0.3,
			color: this.color
		})

		// Draw X axis
		view.transform({
			position:[0, this.yRange[0], this.z_offset]
		}).axis({
		  axis: "x",
		  end: false,
		  width: 6,
		  depth: 1,
		  color: this.color,
		  opacity: .5,
		})
		
		// Draw Y axis
		view.transform({
			position:[this.xRange[1], 0, this.z_offset]
		}).axis({
		  axis: "y",
		  end: true,
		  width: 6,
		  depth: 1,
		  color: this.color,
		  opacity: .5,
		})

		// Draw Y axis labels and ticks
		view.scale({
	      divide: 4,
	      origin: [this.xRange[1], this.yRange[0], this.z_offset],
	      axis: "y",
	      nice: false
	    })
	    .ticks({
	      classes: ['foo', 'bar'],
	      width: 10
	    })
	    .text({
	    	live: false,
	    	data: interpolate(this.yRange[0], this.yRange[1], 5)
	    })
	    .label({
	    	color: this.color,
	    	background: backgroundColor
	    	// offset: [1,1]
	    })

	    // Y axis id
        view.array({
			data: [[this.xRange[1], 0.1*(this.yRange[1]-this.yRange[0]) + this.yRange[1], this.z_offset]],
			channels: 3, // necessary
			live: false,
	    }).text({
	      data: [this.id],
	    }).label({
	      color: this.color,
	      background: backgroundColor
	    });		

	    // projection at 2300
        view.array({
        	id: this.id+'-label-position',
			data: [[this.xRange[1], 0.1*(this.yRange[1]-this.yRange[0]) + this.yRange[1], this.z_offset]],
			channels: 3, // necessary
			live: false,
	    }).text({
	    	id: this.id+'-label-text',
	      data: [0],
	    }).label({
	      color: this.color,
	      background: backgroundColor
	    });		

	    this.labelPosition = this.mathbox.select('#'+this.id+'-label-position')
	    this.labelText = this.mathbox.select('#'+this.id+'-label-text')

	}

	update(y){
		var newData=_.zip(this.x, y, this.z)
		// this.chart =this.mathbox.select("#"+this.id)
		this.chart.set('data', newData)
		this.labelPosition.set('data', [[this.xRange[1], y[numData-1], this.z_offset]])
		this.labelText.set('data', [y[numData-1].toPrecision(3)])
	}
}
