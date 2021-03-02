import React, { Component } from "react";
import EmpChartView from './EmpChartView';
import _ from 'lodash';

class EmpChart extends Component {

    handleDesignData=()=>{
      let dataObject = {};
        _.forEach(this.props.services, function(service, index){
          dataObject[index+1] = false;
      });

      function handleStatusColor (color){
        if(color === 'RED'){
          return '#EE3942'
        }
        else if(color === 'GREEN'){
          return '#4BB752'
        }
        else return '#FFB803'
      }
        
      let graphDataArray =[]
      
      _.forEach(this.props.data['empList'],function(empL){
          let count = 1;
          let graphData = {
              EmpId : empL['empId'],
              overAll: handleStatusColor(empL['profileStatus']),
              ...dataObject
          }
          empL['checks'].map((d,index)=>{
              if(d['status']==='done'){
                graphData[count] = true
                count++;
              }
              return null;
          })
          
          graphDataArray.push(graphData);
      })
      return graphDataArray;
    } 

    
    
    render(){

        return(
            <React.Fragment>
              {this.props.data ? 
               <EmpChartView 
                data = {this.handleDesignData()}
                count = {this.props.data.bgvInitiated}
                total = {this.props.data.totalEmployees}/>
                : null }
            </React.Fragment>
        )
    }
}

export default EmpChart;