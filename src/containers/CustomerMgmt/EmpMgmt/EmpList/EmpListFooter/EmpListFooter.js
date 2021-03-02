import React, { Component } from "react";
import AssignTags from "./AssignTags/AssignTags";
import Deploy from "./Deploy/Deploy";

class EmpListFooter extends Component { 
    
    render(){
        return (
            <React.Fragment>
            {this.props.actionType === "assign" ? 
                <AssignTags
                    selectedEmployees = {this.props.selectedEmployees}
                    closeFooter = {this.props.closeFooter}
                    selectAll={this.props.selectAll}
                    totalEmployeeCount={this.props.totalEmployeeCount}
                />
                : 
                <Deploy 
                    selectedEmployee = {this.props.selectedEmployees}
                    closeFooter = {this.props.closeFooter}
                    selectAll={this.props.selectAll}
                />
        }
        </React.Fragment>
        )   
    }
}

export default EmpListFooter;