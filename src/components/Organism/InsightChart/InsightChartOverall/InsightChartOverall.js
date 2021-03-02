import React, { Component } from "react";
import * as d3 from "d3";
import test from '../../../../assets/icons/waveAni.gif';
import styles from './InsightChartOverall.module.scss';
import _ from "lodash";

class InsightChartOverall extends Component {

    componentDidMount() {
        var data = [
            _.cloneDeep(this.props.data)
        ];

        var margin = { top: 0, right: 0, bottom: 0, left: 10 },
            width = "100%",
            height = 190;

        var x0 = d3.scaleBand().range([0, width]);

        var x1 = d3.scaleBand();

        var y = d3.scaleLinear().range([950, 0]);

        var color = d3.scaleOrdinal().range(["#EE434C", "#FFB803", "#55BB5C", "#EDF3F9", "#0059B2"]);

        var svg = d3
            .select("#test2")
            .append("svg")
            // .attr("viewBox", `0 0 10 10`)
            .attr("width", width)
            .attr("height", height)
            .style("color", "grey")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")
            .attr("transform", "rotate(90 475 475)")
            .style("background-image", 'url(' + test + ')');

        var yBegin;

        var innerColumns = {

            column1: ["RED", "INPROGRESS", "GREEN", "YELLOW"],
            column2: ["INITIATED"]

        };

        var columnHeaders = d3.keys(data[0])
        // .filter(function (key) {
        //     return key !== "Category";
        // });

        color.domain(
            d3.keys(data[0]).filter(function (key) {
                return key !== "Category";
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
                        };
                    }
                }

                return true
            });
            d.total = d3.max(d.columnDetails, function (d) {
                return d.yEnd;
            });
        });

        x0.domain(
            data.map(function (d) {
                return d.Category;
            })
        );
        x1.domain(d3.keys(innerColumns)).range([1, x0.bandwidth()]);

        y.domain([0, d3.max(data, function (d) { return d.total; })]);

        var stackedbar = svg
            .selectAll(".stackedbar")
            .data(data)
            .enter()
            .append("g")
            .attr("height", 900)
            .attr("width", width)
            .attr("class", "g")
            .style("opacity", "0.85")
            .style("background-image", 'url(' + test + ')')
            .attr("transform", function (d) {
                return "translate(0,0)";
            })

        stackedbar
            .selectAll("rect")
            .data(function (d) {
                return d.columnDetails;
            })
            .enter()
            .append("rect")
            .attr("width", 95)
            .attr("x", function (d) {
                if (d.column === "column1") {
                    return 95
                }
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("height", function (d) {
                return 20;
            })
            .style("fill", function (d) {
                return color(d.name);
            })

            .on("mouseover", function (d) {
                if (d.column === "column1") {
                    d3.select("#tooltip2")
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("opacity", 1)
                        .style("Background-color", "white")
                        .style("font-size", "16px")
                        .style("box-shadow", " 0 2px 4px 0 rgba(0,0,0,0.12)")
                        .select("#value2")
                        .text(function () {
                            let str = "";
                            str = d.yEnd - d.yBegin
                            return str;
                        });
                    d3.select("#val2")
                        .style("color", "#768094")
                        .style("font-size", "10px")
                        .text(function () {
                            let str = "";
                            str = getLabel(d.name)
                            return str;
                        })
                }
            })

            .on("mouseout", function () {
                d3.select("#tooltip2")
                    .style("opacity", 0);
            });

        stackedbar.selectAll("rect")
            .transition()
            .duration(1500)
            .attr("y", function (d) {
                return y(d.yEnd);
            })
            .attr("height", function (d) {
                return y(d.yBegin) - y(d.yEnd);
            })
            .delay(function (d, i) { return (i * 5) })


        function getLabel(name) {
            let names = {
                "RED": "red case",
                "GREEN": "green case",
                "YELLOW": "yellow case",
                "INPROGRESS": "in progress",
                "INITIATED": "initiated"
            }
            return names[name];
        }
    }

    render() {
        return (
            <React.Fragment>

                {this.props.data.INITIATED !== 0 && this.props.data.INITIATED !== undefined ?
                    <div id="test2" className={styles.chartBg}>
                        <div id={"tooltip2"} className={styles.tooltip2} >
                            <div id={"value2"} className={styles.value2}></div>
                            <div id={"val2"} ></div>
                        </div>
                        <span className={styles.tab}>
                            <span>initiated employees </span>
                            <span className={styles.tabContent}>{this.props.data.INITIATED}</span>
                        </span>
                    </div>
                    : 
                    <div className={styles.chartBg}>
                        <div className={styles.noDataBg}>
                        <span className={styles.tabNoData}>
                            <span>initiated employees </span>
                            <span className={styles.tabContent}>00</span>
                        </span>
                        </div>
                        <div className={styles.noDataBg}>
                        <div className={styles.tabNoData}>
                            <span>verified profiles </span>
                            <span className={styles.tabContent}>00</span>
                        </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}
export default InsightChartOverall;