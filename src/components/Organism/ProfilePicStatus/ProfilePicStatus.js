import React, { Component } from 'react';
import ProfilePicStatusSmall from './ProfilePicStatusSmall/ProfilePicStatusSmall';
import PorfilePicStatusLarge from './ProfilePicStatusLarge/ProfilePicStatusLarge';
import PorfilePicStatusMini from './ProfilePicStatusMini/ProfilePicStatusMini';
import _ from 'lodash';

class ProfilePicStatus extends Component {
    
    
    handleVerificationData = (data) => {
        let arr = []
        if (!data) {
            return [{}]
        } else {
            if(data && data.idcards && data.idcards.checks){
                _.forEach(data.idcards.checks , function(idcard){
                    if(idcard.status !== "missing_info") {
                        let obj = {
                            docType: idcard.service,
                            result: idcard.status,
                            comment: (idcard.result && idcard.result.comments ? idcard.result.comments[idcard.result.comments.length - 1] : null),
                            status: (idcard.result ? idcard.result.clientStatus : null)
                        }
                        arr.push(obj)
                    }
                })
            }
            if(data && data.legal && data.legal.checks){
                _.forEach(data.legal.checks , function(legal){
                    if(legal.status !== "missing_info") {
                        let obj = {
                            docType: legal.service,
                            result: legal.status,
                            comment: (legal.result && legal.result.comments ? legal.result.comments[legal.result.comments.length - 1] : null),
                            status: (legal.result ? legal.result.clientStatus : null)
                        }
                        arr.push(obj)
                    }
                })
            }
            if(data && data.reference && data.reference.checks){
                _.forEach(data.reference.checks , function(reference){
                   if(reference.status !== "missing_info") {
                        let obj = {
                            docType: reference.service,
                            result: reference.status,
                            comment: (reference.result && reference.result.comments ? reference.result.comments[reference.result.comments.length - 1] : null),
                            status: (reference.result ? reference.result.clientStatus : null),
                        }
                        arr.push(obj)
                   }
                })
            }
          
            
            if(data && data.career && data.career.checks){
                _.forEach(data.career.checks , function(career){
                    if(career.status !== "missing_info") {
                        let obj = {
                            docType: career.service,
                            result: career.status,
                            comment: (career.result && career.result.comments ? career.result.comments[career.result.comments.length - 1] : null),
                            status: (career.result ? career.result.clientStatus : null),
                        }
                        arr.push(obj)
                    }
                })
            }
            if(data && data.health && data.health.checks){
                _.forEach(data.health.checks , function(health){
                    if(health.status !== "missing_info") {
                        let obj = {
                            docType: health.service,
                            result: health.status,
                            comment: (health.result && health.result.comments ? health.result.comments[health.result.comments.length - 1] : null),
                            status: (health.result ? health.result.clientStatus : null)
                        }
                        arr.push(obj)
                    }
                })
            }
            if(data && data.address && data.address.checks){
                _.forEach(data.address.checks , function(address){
                    if(address.status !== "missing_info") {
                        let obj = {
                            docType: address.service,
                            result: address.status,
                            comment: (address.result && address.result.comments ? address.result.comments[address.result.comments.length - 1] : null),
                            status: (address.result ? address.result.clientStatus : null)
                        }
                        arr.push(obj)
                    }
                })
            }
            // let list = arr.reduce((r, i) => 
            //     !r.some(j => !Object.keys(i).some(k => i[k] !== j[k])) ? [...r, i] : r, []);

            return arr;

        }
    }

    render(){ 
        return(
            <React.Fragment>
                {this.props.type === "small" ?
                <ProfilePicStatusSmall
                    id={this.props.id}
                    src={this.props.src}
                    index={this.props.index}
                    serviceStatus={this.handleVerificationData(this.props.serviceStatus)}
                    gray={this.props.gray}
                    isActive={this.props.isActive}
                />
                
                : 
                this.props.type === "mini" ?
                <PorfilePicStatusMini
                    id={this.props.id}
                    src={this.props.src}
                    index={this.props.index}
                    serviceStatus={this.handleVerificationData(this.props.serviceStatus)}
                    gray={this.props.gray}
                />
                :
                <PorfilePicStatusLarge
                    id={this.props.id}
                    src={this.props.src}
                    index={this.props.index}
                    serviceStatus={this.handleVerificationData(this.props.serviceStatus)}
                    gray={this.props.gray}
                    reDraw = {this.props.reDraw}
                />
             }
            </React.Fragment>
        )
    }
}

export default ProfilePicStatus;