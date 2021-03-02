import React, { Component } from "react";
import * as d3 from "d3";
import cx from 'classnames';
import styles from './InsightChartChecks.module.scss';
import arrowRight from "../../../../assets/icons/arrowRightSmall.svg";
import checkLevel from "../../../../assets/icons/checkLevel.svg";
import _ from "lodash";
import scrollStyle from '../../../Atom/ScrollBar/ScrollBar.module.scss';

class InsightChartChecks extends Component {

    componentDidMount() {

        var data = _.cloneDeep(this.props.data);

        var margin = { top: 0, right: 20, bottom: 0, left: 0 },
            width = 100 * data.length,
            height = 200 - margin.top - margin.bottom;

        var x0 = d3.scaleBand().range([0, width]);

        var x1 = d3.scaleBand();

        var y = d3.scaleLinear().range([height, 0]);

        var xAxis = d3.axisBottom(x0);

        var yAxis = d3.axisLeft(y).tickFormat(d3.format(".0f")).ticks(5);

        var color = d3.scaleOrdinal().range(["#0B60B5", "#EE434C", "#FFB803", "#55BB5C", "#EDF3F9"]);

        var svg = d3
            .select("#test")
            .append("svg")
            .attr("width", width + 18)
            .style("margin-top", "5px")
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")

        var yBegin;

        var innerColumns = {
            column1: ["INITIATED",],
            column2: ["RED", "YELLOW", "GREEN", "INPROGRESS"]
        };
        var columnHeaders = d3.keys(data[0])

        color.domain(
            d3.keys(data[0]).filter(function (key) {
                return key !== "CATEGORY";
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
                            cat: d["CATEGORY"]
                        };
                    }
                }
                return true
            });
            
            d.columnDetails.pop();
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

        var svgY = d3.select('#verticalSVG')
            .append('svg')
            .attr('height', height + 10)
            .attr("width", 50);

        svgY.append('g')
            .call(yAxis)
            .attr("stroke", "#8697A8")
            .attr('transform', "translate(49, 5)");;

        svg.append("g")
            .attr("class", "grid")
            .style("stroke-dasharray", "4 5")
            .style("color", "#EBECFD")
            .style("opacity", "0.8")
            .style("stroke-width", "2")
            .call(make_y_gridlines()
                .tickSize(-width)
            )

        svg.append("g")
            .style("color", "#E4EAF1")
            .style("stroke-width", "2")
            .attr('transform', "translate(0, 199)")
            .call(xAxis);

        var stackedbar = svg
            .selectAll(".stackedbar")
            .data(data)
            .enter()
            .append("g")
            .style("color", "red")
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
            .attr("width", 32)
            .attr("x", function (d) {
                if (d.column === "column1") {
                    return (x1(d.column) + x1.bandwidth()) / 2 - 10
                } else return x1(d.column) + x1.bandwidth() - 48
            })
            .attr("y", function (d) { return y(0); })
            .attr("height", function (d) { return height - y(0); })
            .style("fill", function (d) { return color(d.name); })

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
                        str = d.yEnd - d.yBegin
                        return str;
                    });

                d3.select("#val")
                    .style("background-color", color(d.name))
                    .style("border-radius", "70%")
                    .style("padding-right", "10px")
                    .text("")
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

        function make_y_gridlines() {
            return d3.axisLeft(y)
        }
    }

    handleNoData = ()=>{
        let count = 0;
        let data = _.cloneDeep(this.props.data);
        data.forEach(function (d) {
            if(d.CATEGORY === ""){
                count ++;
            }
        })
        if(count === data.length){
            return true
        }else return false
    }

    render() {
        return (
            <React.Fragment>
                {!_.isEmpty(this.props.data) ?
                    <div style={{ backgroundColor: "white", marginRight: '0.65rem' }}>
                        <div className={cx(styles.legends, "py-4 d-flex")}>
                            <div className="ml-auto d-flex mr-4">
                                <div className="d-flex"><div className={styles.initiated} /><div className={styles.contentTab}>initiated</div></div>
                                <div className="d-flex"><div className={styles.inprogress} /><div className={styles.contentTab}>in progress</div></div>
                                <div className="d-flex"><div className={styles.green} /><div className={styles.contentTab}>green case</div></div>
                                <div className="d-flex"><div className={styles.yellow} /><div className={styles.contentTab}>yellow case</div></div>
                                <div className="d-flex"><div className={styles.red} /><div className={styles.contentTab}>red case</div></div>
                            </div>
                        </div>
                        <div className="d-flex">

                            <div id={"verticalSVG"} className={styles.yAxisMark}>

                            </div>
                            <div className={cx(styles.chart, scrollStyle.scrollbar)} >
                                <div id="test" >
                                    <div id={"tooltip"} className={styles.tooltip} >
                                        <span id={"val"}></span>
                                        <span id={"value"} className={cx(styles.value)}></span> 
                                    </div>
                                    {this.handleNoData() ?
                                            <div className={styles.noDataTab}>
                                                no data available
                                            </div> : null
                                        }
                                </div>
                                <div className={styles.xaxis} >
                                    {this.props.data.map((dt, index) => {
                                        return (
                                            <div key={index} className={styles.xLabel}>{dt.CATEGORY.replace(/_/g, " ").toLowerCase()}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles.profile}>profiles
                        <img src={arrowRight} alt="right" className="ml-2" />
                        </div>
                    </div>
                    : <span >
                        <img src={checkLevel} alt="check level" style={{ width: "950px" }} />
                    </span>}

            </React.Fragment>
        )
    }

}
export default InsightChartChecks;