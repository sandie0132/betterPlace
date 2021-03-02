import React, { Component } from "react";
import * as d3 from "d3";
import cx from 'classnames';
import styles from './OnboardInsightLineChart.module.scss';
import _ from "lodash";
import scrollStyle from "../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss";
import Loader from "../../../../../../../components/Organism/Loader/Loader";
import arrowRight from "../../../../../../../assets/icons/arrowRightSmall.svg";

class OnboardInsightLineChart extends Component {

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
        var data = this.props.data;

        var width = 100 * (data.length), height = 220

        var dataset = data.map(function (d) { return { "y": d["ATTRITION"], "LABEL": d["TIME"], "index": d["index"], "ONBOARDED": d["ONBOARDED"], "TERMINATED": d["TERMINATED"] } })

        var xScale = d3.scaleBand().range([0, width]).domain(
            dataset.map(function (d) {
                return d.index;
            }));

        var xAxis = d3.scaleBand().range([0, width]).domain(
            dataset.map(function (d) {
                return d.LABEL;
            }));

        var yScale = d3.scaleLinear().domain([0, d3.max(dataset, function (d) { return d.y; })]).range([height, 0]);;

        var line = d3.line()
            .x(function (d, i) { return xScale(i) + 50; })
            .y(function (d) { return yScale(d.y); })

        var svg = d3.select("#test").append("svg")
            .attr("width", width + 50)
            .attr("height", height + 50)
            .append("g")
            .attr("transform", "translate(0," + 10 + ")");

        var svgY = d3.select('#verticalSVG')
            .append('svg')
            .attr('height', height + 20)
            .attr("width", 50)
            .attr('transform', "translate(0, 0)");

        svgY.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d3.format(".0f")).ticks(5))
            .attr("stroke", "#8697A8")
            .attr('transform', "translate(49, 10)");

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
            .attr("class", styles.xAxisMark)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis));

        svg.append("path")
            .datum(dataset)
            .attr("class", styles.line)
            .attr("d", line);

        svg.selectAll(".dot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", styles.dot)
            .attr("cx", function (d, i) { return xScale(i) + 50 })
            .attr("cy", function (d) { return yScale(d.y) })
            .attr("r", 5)

            .on("mouseover", function (d) {
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + 5 + "px")
                    .style("top", d3.event.pageY - 50 + "px")
                    .style("opacity", 1)
                    .style("Background-color", "white")
                    .style("box-shadow", "0 1px 7px 0 rgba(0,0,0,0.06)")
                    .select("#label")
                    .text(function () {
                        return d["LABEL"];
                    })

                d3.select("#tooltip")
                    .select("#value1")
                    .text(function () {
                        return d["ONBOARDED"];
                    })

                d3.select("#tooltip")
                    .select("#value2")
                    .text(function () {
                        return d["TERMINATED"];
                    })

                d3.select("#tooltip")
                    .select("#value3")
                    .text(function () {
                        return (d["y"]).toFixed(2) + "%";
                    });
            })

            .on("mouseout", function () {
                d3.select("#tooltip")
                    .style("opacity", 0);
            });


        function make_y_gridlines() {
            return d3.axisLeft(yScale)
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

                        </div>

                    </div>
                    <div className={styles.profile}>profiles
                        <img src={arrowRight} alt="right" className="ml-2" />
                    </div>
                </React.Fragment>
        )
    }
}

export default OnboardInsightLineChart;