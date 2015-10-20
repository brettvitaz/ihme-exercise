function App() {
    var self = this;

    // Show loader

    self.data = {};
    self.chart = new Chart({});

    self.init()
}

App.prototype.init = function () {
    var self = this;

    self.preload(function () {
        // Hide loader
        // Draw chart
        self.chart.updateDataSet(self.data.dataset);
        self.chart.draw();
        self.chart.displayControls();
    });
};

App.prototype.preload = function (callback) {
    var self = this;

    d3.csv("data/IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.CSV", function (data) {
        if (null === data) {
            d3.select('body')
                .append('p')
                .text('Could not display chart because the data failed to load.')
        } else {
            self.data.dataset = data;
            callback();
        }
    });
};