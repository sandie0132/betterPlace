import React, { Component } from "react";
import cx from 'classnames';
import InfoCard from './InfoCard';
import VerifyInfo from './VerifyInfo';
import styles from './VerifyLink.module.scss';


class VerifyLink extends Component {

    render() {
      //  console.log("2",this.props.data);
        
        return (
            <React.Fragment>
                {this.props.type!=='reference'?
                <div className="d-flex flex-row justify-content-center">
                    <div>
                    <div className="mt-3">
                        <InfoCard
                           type={this.props.type}
                           data={this.props.data}


                        />
                    </div>
                    <div className="mt-3">
                        <VerifyInfo
                            type={this.props.type}
                            data={this.props.data}

                        />
                    </div>
                </div> </div>
                :
                <div className="d-flex flex-row justify-content-center">
                    <div>
                     <div className="mt-3">
                        <InfoCard
                           type={this.props.type}
                           data={this.props.data}

                         

                        />
                    </div>
                    </div>


                </div>
                }

                <div className="mt-3 mx-auto">
                    <hr className={styles.bottomLine} />
                </div>

                <div className={cx(styles.bottomTextContainer, "mt-2 mb-2 mx-auto")}>
                    <span className={styles.infoSecondHeading}><span className={styles.activeLink} onClick={() => window.open("http://betterplace.co.in")}>BetterPlace Safety Solutions Private Limited</span> is authorized to act on behalf of
                        a client in respect to background screening of a prospective candidate Background
                        screening is the process of thoroughly verifying the history of a job applicant in
                        order to ascertain any information which is relevant to his or her application.</span>
                </div>



            </React.Fragment>
        )
    }

}

export default VerifyLink;