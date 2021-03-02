import React, { Component } from "react";
import * as d3 from "d3";
import styles from './ProfilePicStatusMini.module.scss';
import cx from 'classnames';
import _ from 'lodash';
import defaultPic from "../../../../assets/icons/defaultPic.svg";
import themes from '../../../../theme.scss';
//import panConfigIcon from '../../../assets/icons/panSmallIcon.svg';
// import aadhaarConfigIcon from '../../../assets/icons/aadharSmallIcon.svg';
// import voterConfigIcon from '../../../assets/icons/voterSmallIcon.svg';
// import currentAddressConfigIcon from '../../../assets/icons/mapSmallIcon.svg';
// import permanentaddressConfigIcon from '../../../assets/icons/addressSmallIcon.svg';
// import drivingLicenseConfigIcon from '../../../assets/icons/dlSmallIcon.svg';
// import defaultIcon from '../../../assets/icons/defaultIcon.svg';
// import vehicleregistrationConfigIcon from '../../../assets/icons/rcSmallIcon.svg';

class ProfilePicStatusMini extends Component {

  componentDidMount() {
    const thisRef = this;
    let can = d3.select("#chart" + this.props.index).append("svg").attr("height", 40).attr("width", 40);
    let r = 20;
    let data = !_.isEmpty(this.props.serviceStatus) ? this.props.serviceStatus : [{}];
    let group = can.append("g")
      .attr("transform", "translate(20,20)");

    let arc = d3.arc()
      .innerRadius(r - 4)
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
          .style("margin-left", 2 + "px")
          .style("margin-top", 2 + "px")
          .style("opacity", 1)
          .style("Background-color", getBgcColor(d.data.status, d.data.result))
          .select("#value" + thisRef.props.index)
          .style("color", "black")
          .style("fontSize", "12px")
          .text(function () {
            let str = "";
            str = d.data.docType ? d.data.docType.replace(/_/g, " ") : null;
            return str;
          }
          )
        d3.select("#tooltip" + thisRef.props.index)
          .style("left", d3.event.pageX - 285 + "px")
          .style("top", d3.event.pageY - 150 + "px")
          .style("opacity", 1)
          .select("#val" + thisRef.props.index)
          .style("color", getCommentColor(d.data.status, d.data.result))
          .text(function () {
            let str = "";
            str = getComment(d.data)
            return str;
          }
          )
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
      }
      );

    let imgPattern = can.append("pattern")
      .attr("id", "imgPattern" + thisRef.props.index)
      .attr("height", "100%")
      .attr("width", "100%")

    imgPattern.append("image")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 30)
      .attr("width", 30)
      .attr("xlink:href", !_.isEmpty(thisRef.props.src) ? thisRef.props.src : defaultPic)

    can.append("circle")
      .attr("r", 15)
      .attr("cy", 20)
      .attr("cx", 20)
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
        {/* <img src={this.props.src} /> */}
        <div id={"tooltip" + this.props.index} className={styles.tooltip}>
          {/* <img src={panConfigIcon} className={styles.icon} alt="img"/>&nbsp; */}
          <span id={"value" + this.props.index} className={cx(styles.value)}></span><br />
          <span id={"val" + this.props.index} ></span>


        </div>
      </div>
    )
  }
}

export default ProfilePicStatusMini;