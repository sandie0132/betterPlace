import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";
import styles from "./TatComparison.module.scss";
import cx from "classnames";
import arrowRight from "../../../../assets/icons/arrowRightSmall.svg";
// import arrowUp from "../../../../assets/icons/arrowUpSmall.svg";


class TatComparison extends Component {

    componentDidMount() {
        var data = [_.cloneDeep(this.props.data)];
        var yColumn = [];
        var height = 200;

        var columnHeaders = d3.keys(data[0])
            .filter(function (key) {
                return key !== "AVG" && key !== "AGREE";
            });

        data.forEach(function (d) {
            columnHeaders.map(function (day, index) {
                let ic = {
                    day: day,
                    profile: d[day],
                    index: index + 1
                }
                yColumn.push(ic)
                return true;
            });
            if (!_.isEmpty(columnHeaders)) {
                for (let i = 0; i < 18 - columnHeaders.length; i++) {
                    let ic = {
                        day: "",
                        profile: "",
                        index: i + columnHeaders.length + 1
                    }
                    yColumn.push(ic)
                }
            }
            return true;
        });
        var width = 50 * yColumn.length - 1;
        var x = d3.scaleBand().range([0, width])

        var y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(yColumn.map(function (d) { return d.index; }));

        y.domain([0, d3.max(yColumn, function (d) { return Number(d.profile); })]);

        var svg = d3.select("#tat")
            .append("svg")
            .attr("width", width + 100)
            .attr("height", !_.isEmpty(columnHeaders) ? 250 : 210)
            .attr('transform', "translate(0, 10)");

        svg.append("g")
            .attr("class", "grid")
            .style("stroke-dasharray", "4 5")
            .style("color", "#EBECFD")
            .style("opacity", "0.8")
            .style("stroke-width", "2")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        var svgY = d3.select('#yAixs')
            .append('svg')
            .attr('height', height + 20)
            .attr("width", 50)
            .attr('transform', "translate(0, 0)");

        svgY.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", styles.yAxisProfiles)
            .style("font-size", "12px")
            .text("profiles →")


        svgY.append("image")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 40)
        // .attr("x",14 )
        // .attr("dy", "1em")
        // .attr('xlink:href', arrowUp);

        svgY.append('g')
            .call(d3.axisLeft(y).tickFormat(d3.format(".0f")).ticks(5))
            .attr("stroke", "#8697A8")
            .attr('transform', "translate(49, 10)");;

        var g = svg.append("g").attr("transform", "translate(9,0)");

        g.append("g")
            .attr("class", styles.yAxisMark)
            .attr("transform", "translate(-10," + height + ")")
            .attr("stroke", "#8697A8")
            .call(d3.axisBottom(x).tickFormat(function (d) {
                var filtered = yColumn.filter(function (e) {
                    return e.index === d
                });
                return filtered[0].day;
            }))

        g.selectAll(".bar")
            .data(yColumn)
            .enter()
            .append("rect")
            .attr("x", function (d) { ; return x(d.index); })
            .attr("line", "red")
            .attr("y", function (d) { return y(d.profile); })
            .attr("fill", function (d) {
                if (d.day <= data[0]["AGREE"]) {
                    return "#BFD554"
                }
                else return "#FF8095"
            })
            .attr("width", 25)
            .attr("height", function (d) { return height - y(d.profile); })

            .on("mouseover", function (d) {
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("opacity", 1)
                    .style("Background-color", "white")
                    .style("box-shadow", " 0 2px 4px 0 rgba(0,0,0,0.12)")
                    .select("#value")
                    .text(function () {
                        let str = "";
                        str = d.profile
                        return str;
                    });

                d3.select("#val")
                    .style("background-color", 
                    function () {
                    if (d.day <= data[0]["AGREE"]) {
                        return "#BFD554"
                    }
                    else return "#FF8095"})
                    .style("border-radius", "70%")
                    .style("padding-right", "10px")
                    .text("")
            })

            .on("mouseout", function () {
                d3.select("#tooltip")
                    .style("opacity", 0);
            });


        function make_y_gridlines() {
            return d3.axisLeft(y)
        }
    }

    render() {
        let tatData = [_.cloneDeep(this.props.data)];
        tatData = d3.keys(tatData[0]).filter(function (key) {
            return key !== "AVG" && key !== "AGREE";
        });
        return (
            <React.Fragment>
                <div className={cx(styles.chartBackground)} >
                    <div className={cx(styles.legends, " d-flex py-4")}>
                        <div className="ml-auto d-flex mr-4">
                            <div className="d-flex">
                                <div className={styles.lessThanAgree} />
                                <div className={styles.contentTab}>
                                    less than agreed tat - {this.props.data["AGREE"]} &nbsp; days
                            </div>
                            </div>
                            <div className="d-flex">
                                <div className={styles.moreThanAgree} />
                                <div className={styles.contentTab}>more than agreed tat </div>
                            </div>
                        </div>

                    </div>
                    <div className="d-flex">

                        {/* <div className={styles.yAxisProfiles}>
                            profiles<img src={arrowRight} alt="right" className="ml-2" />
                        </div> */}
                        <div id={"yAixs"} className={styles.yAxisMark} />

                        <div className={styles.chart} >
                            <div id="tat" style={_.isEmpty(tatData) ? { borderBottom: "1px solid #E4EAF1" } : null}>
                                <div id={"tooltip"} className={styles.tooltip} >
                                    <span id={"val"}></span>
                                    <span id={"value"} className={cx(styles.value)}></span> 
                                </div>
                                {_.isEmpty(tatData) ?
                                    <div className={styles.noDataTab}>
                                        no data available
                                    </div> : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.days}>days
                        <img src={arrowRight} alt="right" className="ml-2" />
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default TatComparison;