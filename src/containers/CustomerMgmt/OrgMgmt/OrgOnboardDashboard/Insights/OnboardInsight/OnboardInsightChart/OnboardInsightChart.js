import React, { Component } from "react";
import * as d3 from "d3";
import cx from 'classnames';
import styles from './OnboardInsightChart.module.scss';
import _ from "lodash";
import scrollStyle from "../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss";
import Loader from "../../../../../../../components/Organism/Loader/Loader";
import arrowRight from "../../../../../../../assets/icons/arrowRightSmall.svg";

class OnboardInsightChart extends Component {

    componentDidMount() {
        this.handleDrawSvg();
    }

    componentDidUpdate(prevProps) {
        if(!_.isEqual(this.props.data, prevProps.data)){
            this.removePreviousChart();
            this.handleDrawSvg();
        }
    }

    removePreviousChart() {
        d3.select("#test").selectAll("svg").remove();;
        d3.select("#verticalSVG").selectAll("svg").remove();;
        d3.select("#tooltip").selectAll("svg").remove();;
    }


    handleDrawSvg = () => {
        const empty_data = {
            "TIME": "",
            "TERMINATED": 0,
            "ONBOARDED": 0,
            "ATTRITION": 0
        };
        var data = _.cloneDeep(this.props.data);
        if (this.props.data.length < 10) {
            for (var i = 0; i < (10 - this.props.data.length); i = i + 1) {
                data.push({
                    ...empty_data,
                    "index": this.props.data.length + i
                })
            }
        }

        var width = 100 * (data.length), height = 220;

        var x0 = d3.scaleBand().range([0, width]);

        var x1 = d3.scaleBand();

        var x2 = d3.scaleBand().range([0, width]).domain(
            data.map(function (d) {
                return d.index;
            }));

        var y = d3.scaleLinear().range([height, 0]);

        var yAxis = d3.axisLeft(y).tickFormat(d3.format(".0f")).ticks(5);

        var xAxis = d3.axisBottom(x2);

        var color = d3.scaleOrdinal().range(["#0B60B5", "red", "#A4CEFF"]);

        var svg = d3
            .select("#test")
            .append("svg")
            .attr("width", width + 18)
            .style("margin-top", "5px")
            .attr("height", height + 25)
            .append("g")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")

        var yBegin;

        var innerColumns = {
            column1: ["ONBOARDED"],
            column2: ["TERMINATED"]
        };
        var columnHeaders = ["TIME", "ONBOARDED", "TERMINATED"]

        color.domain(
            d3.keys(data[0]).filter(function (key) {
                return key !== "TIME";
            })
        );

        data.forEach(function (d) {
            var yColumn = [];
            d.columnDetails = columnHeaders.map(function (name) {
                for (let ic in innerColumns) {
                    if (innerColumns[ic].indexOf(name) >= 0) {
                        if (!yColumn[ic]) {
                            yColumn[ic] = 0;
                        }
                        yBegin = yColumn[ic];
                        yColumn[ic] += +d[name];
                        return {
                            name: name,
                            column: ic,
                            yBegin: yBegin,
                            yEnd: +d[name] + yBegin,
                            cat: d["TIME"]
                        };
                    }
                }
                return true
            });
            // d.columnDetails.pop();
            d.columnDetails.shift();
            d.total = d3.max(d.columnDetails, function (d) {
                return d.yEnd;
            });
        });

        x0.domain(
            data.map(function (d) {
                return d.index;
            })
        );

        x1.domain(d3.keys(innerColumns)).range([1, x0.bandwidth()]);

        y.domain([0, d3.max(data, function (d) { return d.total; })]);

        svg.append("path")
            .attr("stroke", "#fff")
            .attr("fill", "#000");

        svg
            .append("g")
            .attr("class", styles.xAxisMark)
            .attr("transform", "translate(0," + height + ")")
            .attr("fill", "#000")
            .call(xAxis.tickFormat((d,i)=>data[i].TIME))

        var svgY = d3.select('#verticalSVG')
            .append('svg')
            .attr('height', height + 10)
            .attr("width", 50);

        svgY.append('g')
            .call(yAxis)
            .attr("stroke", "#8697A8")
            .attr('transform', "translate(49, 5)");

        svg.append("g")
            .attr("class", "grid")
            .style("stroke-dasharray", "4 5")
            .style("color", "#EBECFD")
            .style("opacity", "0.8")
            .style("stroke-width", "2")
            .call(make_y_gridlines()
                .tickSize(-width)
            )

        var stackedbar = svg
            .selectAll(".stackedbar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.index) + ",0)";
            })



        stackedbar
            .selectAll("rect")
            .data(function (d) {
                return d.columnDetails;
            })
            .enter()
            .append("rect")
            .attr("width", 20)
            .attr("x", function (d) {
                if (d.column === "column1") {
                    return (x1(d.column) + x1.bandwidth()) / 2 + 2
                } else return x1(d.column) + x1.bandwidth() - 48
            })
            .attr("y", function (d) { return y(0); })
            .attr("height", function (d) { return height - y(0); })
            .style("fill", function (d) { return color(d.name); })

            .on("mouseover", function (d) {
                var tooltipData = getData(d.cat)
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + 5 + "px")
                    .style("top", d3.event.pageY - 50 + "px")
                    .style("opacity", 1)
                    .style("Background-color", "white")
                    .style("box-shadow", "0 1px 7px 0 rgba(0,0,0,0.06)")
                    .select("#label")
                    .text(function () {
                        return tooltipData["TIME"];
                    })

                d3.select("#tooltip")
                    .select("#value1")
                    .text(function () {
                        return tooltipData["ONBOARDED"];
                    })

                d3.select("#tooltip")
                    .select("#value2")
                    .text(function () {
                        return tooltipData["TERMINATED"];
                    })

                d3.select("#tooltip")
                    .select("#value3")
                    .text(function () {
                        return tooltipData["ATTRITION"].toFixed(2);
                    });
            })

            .on("mouseout", function () {
                d3.select("#tooltip")
                    .style("opacity", 0);
            });


        stackedbar.selectAll("rect")
            .transition()
            .duration(1300)
            .attr("y", function (d) {
                return y(d.yEnd);
            })
            .attr("height", function (d) {
                return y(d.yBegin) - y(d.yEnd);
            })
            .delay(function (d, i) { return (i * 10) })

        function getData(d) {
            let dataObject = _.find(data, function (dt) {
                return dt.TIME === d;
            });
            return dataObject;
        }

        function make_y_gridlines() {
            return d3.axisLeft(y)
        }

    }

    handleNoData = () => {
        let count = 0;
        let data = _.cloneDeep(this.props.data);
        data.forEach(function (d) {
            if (d.CATEGORY === "") {
                count++;
            }
        })
        if (count === data.length) {
            return true
        } else return false
    }

    render() {
        return (
            this.props.state === "LOADING" ?
                <Loader
                    type="chartLoader"
                />
                :
                <React.Fragment>
                    <div className="d-flex">
                        <div id={"verticalSVG"} className={styles.yAxisMark}></div>
                        <div className={cx(styles.chart, scrollStyle.scrollbarBlueMedium)} >
                            <div id="test" >
                                <div id={"tooltip"} className={styles.tooltip} >
                                    <div className={styles.tooltipHeading} id={"label"}></div>
                                    <div className="d-flex">
                                        <div className={styles.borderRight}>
                                            <div>
                                                <span className={styles.initiated}></span>
                                                <span className={cx(styles.tooltipSubHeading)}>onboarding</span>
                                            </div>
                                            <div className={cx(styles.tooltipData, "ml-3")} id={"value1"}></div>
                                        </div>
                                        <div className={styles.borderRight}>
                                            <div>
                                                <span className={styles.inprogress}></span>
                                                <span className={cx(styles.tooltipSubHeading)}>termination</span>
                                            </div>
                                            <div className={cx(styles.tooltipData, "ml-4 pl-2")} id={"value2"}></div>
                                        </div>
                                        <div>
                                            <div>
                                                <span className={styles.attrition}></span>
                                                <span className={cx(styles.tooltipSubHeading)}>attrition rate</span>
                                            </div>
                                            <div className={cx(styles.tooltipData, "ml-4 pl-2")} id={"value3"}></div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className={styles.profile}>{this.props.xLabel}
                                <img src={arrowRight} alt="right" className="ml-2" />
                            </div>
                        </div>
                    </div>

                </React.Fragment>
        )
    }
}

export default OnboardInsightChart;