import React, { Component } from "react";
import InsightChartChecks from './InsightChartChecks/InsightChartChecks';
import InsightChartOverall from './InsightChartOverall/InsightChartOverall';
import TatComparison from "./TatComparison/TatComparison";
import _ from "lodash";

class InsightChart extends Component {
    render(){
        return(
            <React.Fragment>
              { this.props.type === 'checks' ? 
              
               <InsightChartChecks 
                    data = {_.cloneDeep(this.props.data)}
                    type = {this.props.type}
                  />
                : null }

              { this.props.type === 'overAll'? 
               <InsightChartOverall
                    data = {_.cloneDeep(this.props.data)}
                    type = {this.props.type}
                />
                : null }

              { this.props.type === 'tat'? 
               <TatComparison
                    data = {_.cloneDeep(this.props.data)}
                    type = {this.props.type}
                />
                : null }
              
            </React.Fragment>
        )
    }
}

export default InsightChart;