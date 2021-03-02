import { connect } from 'react-redux';
import _ from 'lodash';

const check = (policies, permission, orgId, denySuperAdminAccess, skipHasAccess) => {
    if(skipHasAccess === true) return true; //use this prop to skip HasAccess validations 

    let allowAccess = false;
    if(orgId){
        _.forEach(policies, function(policy){
            if(policy.orgId === orgId || policy.orgId === '*'){
                if(_.intersection(policy.businessFunctions, permission).length || _.includes(policy.businessFunctions, '*')){
                    allowAccess = true;
                }
            }
        })
    }
    else{
        _.forEach(policies, function(policy){
                if(_.intersection(policy.businessFunctions, permission).length || _.includes(policy.businessFunctions, '*')){
                allowAccess = true;
            }
        }) 
    }
   
    if(denySuperAdminAccess){
        _.forEach(policies, function(policy){
            if(_.includes(policy.businessFunctions, '*')){
                allowAccess = false
            }
        })
    }
    return allowAccess
};

const HasAccess = props =>
   check(props.policies, props.permission, props.orgId, props.denySuperAdminAccess, props.skipHasAccess)
       ? props.yes()
       : props.no();

   HasAccess.defaultProps = {
       yes: () => null,
       no: () => null
};

const mapStateToProps = state => {
   return {
       user: state.auth.user,
       policies: state.auth.policies
   };
};

export default connect(mapStateToProps)(HasAccess);