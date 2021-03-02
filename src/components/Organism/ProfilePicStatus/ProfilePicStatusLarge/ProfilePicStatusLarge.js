import React, { Component } from "react";
import * as d3 from "d3";
import styles from './ProfilePicStatusLarge.module.scss';
import cx from 'classnames';
import defaultPic from "../../../../assets/icons/defaultPic.svg";
import themes from '../../../../theme.scss';
import _ from "lodash";

class ProfilePicStatus extends Component {


  componentDidMount() {
    this.handleDrawSvg();
  }

  componentDidUpdate(prevProps) {
    if (this.props.reDraw !== prevProps.reDraw) {
      if (this.props.reDraw === true) {
        this.removePreviousChart();
        this.handleDrawSvg();
      }
    }
  }

  removePreviousChart() {
    d3.select("#chart" + this.props.index).selectAll("svg").remove();;
  }

  handleDrawSvg = () => {
    const thisRef = this;
    let can = d3.select("#chart" + this.props.index).append("svg").attr("height", 120).attr("width", 120);
    let r = 60;
    let data = !_.isEmpty(this.props.serviceStatus) ? this.props.serviceStatus : [{}];

    let group = can.append("g")
      .attr("transform", "translate(60,60)");

    let arc = d3.arc()
      .innerRadius(r - 7)
      .outerRadius(r)


    let pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return data.length;
      });

    let arcs = group.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("className", "arc")
      .attr('stroke', '#fff')
      .attr('stroke-width', '2')
      .attr('fill', function (d) {
        return "#AA66BB "
      })
      .on("mouseover", function (d) {
        d3.select("#tooltip" + thisRef.props.index)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .style("Background-color", getBgcColor(d.data.status, d.data.result))
          .select("#value" + thisRef.props.index)
          .style("color", "black")
          .style("fontSize", "14px")

          .text(function () {
            let str = "";
            str = d.data.docType ? d.data.docType.replace(/_/g, " ") : null;
            return str;
          })
        d3.select("#tooltip" + thisRef.props.index)
          .style("opacity", 1)
          .select("#val" + thisRef.props.index)
          .style("color", getCommentColor(d.data.status, d.data.result))
          .text(function () {
            let str = "";
            str = getComment(d.data)
            return str;

          })

      })

      .on("mouseout", function () {
        d3.select("#tooltip" + thisRef.props.index)
          .style("opacity", 0);
      });



    arcs.append("path")
      .attr("d", arc)
      .style("fill", function (d, i) {
        let color = getArcColor(d.data.status, d.data.result)
        return color;
      })
      .transition()
      .duration(1800)
      .attrTween("d", tweenPie);

    function tweenPie(b) {
      var i = d3.interpolate({ startAngle: 0, endAngle: 0.1 * Math.PI }, b);
      return function (t) { return arc(i(t)); };
    }

    let imgPattern = can.append("pattern")
      .attr("id", "imgPattern" + thisRef.props.index)
      .attr("height", "100%")
      .attr("width", "100%")

    imgPattern.append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 100)
      .attr("width", 100)
      .attr("xlink:href", thisRef.props.src ? thisRef.props.src : defaultPic)

    can.append("circle")
      .attr("r", 50)
      .attr("cy", 60)
      .attr("cx", 60)
      .attr("fill", "url(#imgPattern" + thisRef.props.index + ")");

    function getComment(d) {
      if (d.result === "done") {
        if (!_.isEmpty(d.comment) && !(/^\s*$/.test(d.comment))) {
          return '" ' + d.comment + ' "'
        } else {
          return null;
        }
      } else {
        if(d.docType === "POLICE_VERIFICATION" && !_.isEmpty(d.comment) && !(/^\s*$/.test(d.comment))) {
            return '" ' + d.comment + ' "'
        } else {
          if(d.result === "insufficient_info")
            return '"insufficient information"';
          else if(d.result === "manualReviewPending")
            return '"manual review pending"';
          return '"in progress"';
        }
      }
    }

    function getCommentColor(status, result) {
      if (result === "done") {
        if (status === "RED") {
          return themes.danger
        } else if (status === "GREEN") {
          return themes.success
        } else {
          return themes.warning
        }
      } else if (["inProgress", "insufficient_info", "manualReviewPending"].includes(result)) {
        return "#00004d"
      }
      else {
        return '#ffffff00'
      }
    }

    function getArcColor(status, result) {

      if (result === "done") {
        if (status === "RED") {
          return themes.danger
        } else if (status === "GREEN") {
          return themes.success
        } else {
          return themes.warning
        }
      }
      else {
        return themes.defaultArc
      }
    }

    function getBgcColor(status, result) {
      if (result === "done") {
        if (status === "RED") {
          return themes.errorNotification
        } else if (status === "GREEN") {
          return themes.successNotification
        } else {
          return themes.warningBackground
        }
      }
      else if (["inProgress", "insufficient_info", "manualReviewPending"].includes(result)) {
        return "#e6e6e6"
      }
      else {
        return '#ffffff00'
      }

    }
  }


  render() { 
    return (
      <div id={"chart" + this.props.index} >
        <div id={"tooltip" + this.props.index} className={styles.tooltip}>
          <span id={"value" + this.props.index} className={cx(styles.value)}></span><br />
          <span id={"val" + this.props.index} ></span>
        </div>
      </div>
    )
  }
}

export default ProfilePicStatus;