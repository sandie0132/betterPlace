import React, { Component } from "react";
import styles from './BrandColor.module.scss';
import * as colors from './BrandTheme';
import cx from 'classnames';
import tick from '../../../assets/icons/whiteTick.svg';

class BrandColor extends Component {

    handleSelectColor = (color) => {
        this.props.changed({
            value : color
        })
    }
    render(){
        return (
            <div className={"mt-2 ml-auto mr-4"}>
                <span className={styles.Label}>
                    {this.props.label}
                </span><br/>
                <div className={cx(styles.palletteBG,"mt-1")}> 
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR1)} 
                        className={cx(this.props.disabled ? styles.disable :styles.enableBlack1,styles.black1,"mr-1",
                        this.props.value === colors.COLOR1 ? styles.selectedBlack1 : null)}>
                            {this.props.value === colors.COLOR1 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                        </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR2)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableBlue,styles.blue,"mr-1",
                        this.props.value === colors.COLOR2 ? styles.selectedBlue : null)}>
                            {this.props.value === colors.COLOR2 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR3)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableGrey, styles.grey,"mr-1",
                        this.props.value === colors.COLOR3 ? styles.selectedGrey : null)}>
                            {this.props.value === colors.COLOR3 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR4)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableGreen,styles.green,"mr-1",
                        this.props.value === colors.COLOR4 ? styles.selectedGreen : null)}>
                            {this.props.value === colors.COLOR4 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR5)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableYellow,styles.yellow,"mr-1",
                        this.props.value === colors.COLOR5 ? styles.selectedYellow : null)}>
                            {this.props.value === colors.COLOR5 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR6)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enablePurple,styles.purple,"mr-1",
                        this.props.value === colors.COLOR6 ? styles.selectedPurple : null)}>
                            {this.props.value === colors.COLOR6 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR7)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableRed,styles.red,"mr-1",
                        this.props.value === colors.COLOR7 ? styles.selectedRed : null)}>
                            {this.props.value === colors.COLOR7 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR8)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableBrown,styles.brown,"mr-1",
                        this.props.value === colors.COLOR8 ? styles.selectedBrown : null)}>
                            {this.props.value === colors.COLOR8 ? 
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                    <span onClick={this.props.disabled ? undefined : ()=>this.handleSelectColor(colors.COLOR9)} 
                        className={cx(this.props.disabled ? styles.disable : styles.enableBlack2,styles.black2,"mr-1",
                        this.props.value === colors.COLOR9 ? styles.selectedBlack2 : null)}>
                            {this.props.value === colors.COLOR9 ?
                            <img className={styles.Tick} src={tick} alt=''/> : null}
                    </span>
                </div>
                
            </div>
        )
    }
}
export default BrandColor;