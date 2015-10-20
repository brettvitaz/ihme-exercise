function Chart() {
    var self = this;

    self.defaults = {
        width: 720,
        height: 400,
        margin: {
            top: 20,
            bottom: 50,
            left: 50,
            right: 20
        },
        transitionDuration: 500,
        transitionDelay: 50,
        metricDesired: "obese"
    };

    self.init();
}

Chart.prototype.init = function () {

    self.xScale = d3.scale.ordinal().rangeRoundBands([self.default.margin.left, width - self.default.right], .1);
    self.yScale = d3.scale.linear().range([height - self.default.bottom, self.default.top]);
};

Chart.prototype.updateDataSet = function (data) {
    var self = this;

    self.data = self.filterDataSet(data.filter(function (d) {
        return d.metric == self.defaults.metricDesired;
    }));

    self.yearRange = _.chain(data).pluck("year").unique().compact().reverse().value();
    self.genderRange = _.chain(data).pluck("sex").unique().compact().reverse().value();

    self.xScale.domain(topCountries.map(function (d) {
        return d.location;
    }));

};

Chart.prototype.filterDataSet = function (data) {
    return data
        .filter(function (d) {
            return d.year == parseInt(yearMenu.property("value")) &&
                d.sex == genderMenu.property("value") &&
                d.age_group_id == getAgeGroupSelected().age_group_id;
        })
        .sort(function (a, b) {
            return b.mean - a.mean;
        })
        .slice(0, 10);
};

Chart.prototype.displayControls = function () {
    yearMenu.selectAll("option")
        .data(yearRange)
        .enter().append("option")
        .text(function (d) {
            return d;
        });

    genderMenu.selectAll("option")
        .data(genderRange)
        .enter().append("option")
        .text(function (d) {
            return d;
        });

    ageGroupMenu.selectAll("option")
        .data(ageGroupList)
        .enter().append("option")
        .text(function (d) {
            return d.age_group;
        });

    d3.selectAll("#menuGroup").style("display", "block");
};

Chart.prototype.draw = function () {
    var self = this;

    // The graph appears more interesting when the y scale remains static.
    yScale.domain([0, meanMaxValue * 1.2]);

    var bar = svg.selectAll(".bar").data(topCountries);

    var barEnter = bar.enter().insert("g", ".axis")
        .attr("class", "bar");

    barEnter.append("rect")
        .call(barSvgRect)
        .on("mouseover", function () {
            d3.select(this)
                .style("fill", "orange")
        })
        .on("mouseout", function () {
            d3.select(this)
                .style("fill", getBarColor)
        });

    barEnter.append("title")
        .call(barSvgTitle);

    barEnter.append("line")
        .attr("class", "whiskers")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("opacity", 0)
        .call(barSvgLine);

//        barEnter.append("circle")
//                .attr("class", "whiskers")
//                .attr("r", 3)
//                .style("opacity", 0)
//                .call(barSvgCircle);

    barEnter.append("line")
        .attr("class", "whiskers tickTop")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("opacity", 0)
        .call(barSvgTickTop);

    barEnter.append("line")
        .attr("class", "whiskers tickBottom")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("opacity", 0)
        .call(barSvgTickBottom);

    barEnter.append("text")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .call(barSvgText);

    var barUpdate = d3.transition(bar);

    barUpdate.select("rect")
        .call(barSvgUpdate(barSvgRectUpdate));

    barUpdate.select("title")
        .call(barSvgUpdate(barSvgTitle));

    barUpdate.select("text")
        .call(barSvgUpdate(barSvgText));

    barUpdate.select("line")
        .call(barSvgUpdate(barSvgLine));

//        barUpdate.select("circle")
//                .call(barSvgUpdate(barSvgCircle));

    barUpdate.select("line.tickTop")
        .call(barSvgUpdate(barSvgTickTop));

    barUpdate.select("line.tickBottom")
        .call(barSvgUpdate(barSvgTickBottom));

    svg.select(".x.axis")
        .attr("transform", "translate(0," + (height - (margin.bottom)) + ")")
        .call(xAxis);

    svg.select(".y.axis")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(yAxis);
};