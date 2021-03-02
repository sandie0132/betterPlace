import React, { Component } from 'react';
import cx from 'classnames';
import styles from './Slider.module.scss';



class Slider extends Component {
    // props={
    //     value: 0,
    // }
    

    handleChange=(event)=>{
        let updatedValue = event.target.value;
        this.props.changed({
            value: updatedValue
        });
       
    }

    // componentDidMount(){
    //     let primaryValue= Math.round((parseInt(this.props.max)-parseInt(this.props.min))*15/100+parseInt(this.props.min));

    //     //this.setprops({value: primaryValue});
    //     this.props.changed({
    //         target:{
    //             value: primaryValue
    //         }
    //     });

    // }

    render() {

       
        let percentage = (this.props.value-parseInt(this.props.min))/(parseInt(this.props.max)-parseInt(this.props.min))*100;
        return (
            <React.Fragment>
             
              
            <div className={cx(this.props.className,"d-flex flex-column px-2")}>

              <label className={styles.Label}>{this.props.label}</label>
                <output className={styles.Output}
                    style={{transform: "translate(calc(("+this.props.value+" - "+parseInt(this.props.min)+")/("+parseInt(this.props.max)+" - "+parseInt(this.props.min)+")*29.2em))"}}    
                    >{this.props.unit?this.props.value+this.props.unit:this.props.value}</output>
               
                <div className={styles.OutputLine} 
                style={{transform: "translate(calc(("+this.props.value+" - "+parseInt(this.props.min)+")/("+parseInt(this.props.max)+" - "+parseInt(this.props.min)+")*14.6em))"}}/>
                
                <input className={styles.Slider} 
                    style={{backgroundImage:  "linear-gradient(90deg, #0059B2 "+percentage+"% , #EBECFD 0%)"}} 
                    type="range" min={this.props.min} 
                    max={this.props.max} 
                    value={this.props.value} 
                    onChange={this.handleChange}>
                </input>   
               
                <div className="d-flex justify-content-between">
                <label className={cx(styles.LabelBottom)} >{this.props.unit?this.props.min+this.props.unit:this.props.min}</label>   
                <label className={cx(styles.LabelBottom)} >{this.props.unit?this.props.max+this.props.unit:this.props.max}</label>  
                </div>

                </div>
                
            
           

            </React.Fragment>

        
            
        );

    }
}

export default Slider;
