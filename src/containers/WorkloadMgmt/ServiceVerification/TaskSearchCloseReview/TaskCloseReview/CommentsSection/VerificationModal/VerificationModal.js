import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './VerificationModal.module.scss';
import cx from 'classnames';
import closePage from '../../../../../../../assets/icons/closePage.svg';
import BoxRadioButton from '../../../../../../../components/Molecule/BoxRadioButton/BoxRadioButton';
import scrollStyle from '../../../../../../../components/Atom/ScrollBar/ScrollBar.module.scss';
import { Button } from 'react-crux';
import yellowIcon from '../../../../../../../assets/icons/yellowOption.svg';
import redIcon from '../../../../../../../assets/icons/redOption.svg';
import greenIcon from '../../../../../../../assets/icons/greenCase.svg';
import writeComment from '../../../../../../../assets/icons/writeComment.svg';
// import defaultIcon from '../../../../../../../assets/icons/greyWarningMid.svg';
import { withTranslation } from 'react-i18next';

class VerificationModal extends Component {

    state = {
        commentOptions: [],
        isSelected: false,
        selectedComment: '',
        selectedCommentCase: '',
        selectedIndex: -1,
        charCount: 60,
        writtenComment: '',
        enableDone: false,
        onFocus: false
    }

    componentDidMount = () => {
        this.handlePropsToState();
    }

    handlePropsToState = () => {
        let comments = _.cloneDeep(this.props.comments);

        let isSelected = this.state.isSelected;
        let updatedWrittenComment = this.state.writtenComment;
        let updatedCommentCase = this.state.selectedCommentCase;
        let staticDataComments = [];
        if(!_.isEmpty(comments) ){
            Object.entries(comments).forEach(key => {
                _.forEach(key[1], function(f, index) {
                    let object = {
                        value : key[0].toLowerCase().replace(/_/g, " "),
                        label: key[1][index],
                        icon: key[0] === 'GREEN' ? greenIcon
                        : key[0] === 'RED' ? redIcon
                            : key[0] === 'YELLOW' ? yellowIcon
                                : null
                    }
                    staticDataComments.push(object);
                })
            })
        }
        
        staticDataComments.map(item => {
            item.label = item.label.toLowerCase();
            return null;
        })

        let selectedIndex = this.state.selectedIndex;

        if (this.props.dropdownOption !== 'add comment') {
            staticDataComments.map((item, index) => {
                if (item.label === this.props.dropdownOption) {
                    isSelected = true;
                    selectedIndex = index;
                    updatedCommentCase = this.props.dropdownOption;
                }
                return null;
            })

            if (_.isEmpty(updatedCommentCase)) {
                updatedWrittenComment = this.props.dropdownOption;
            }
        }
        this.setState({
            commentOptions: staticDataComments,
            isSelected: isSelected,
            writtenComment: updatedWrittenComment,
            selectedCommentCase: updatedCommentCase,
            selectedIndex: selectedIndex
        });
    }

    handleInputChange = (event, item, index) => {
        event.persist();
        let updatedWrittenComment = this.state.writtenComment;
        let selectedComment = this.state.selectedComment;
        let selectedCommentCase = this.state.selectedCommentCase;
        let enableDone = false;

        let isSelected = this.state.isSelected;
        const prevIndex = this.state.selectedIndex;
        isSelected = index === prevIndex ? !isSelected : (isSelected === false ? !isSelected : isSelected);

        isSelected = index === undefined ? false : isSelected;

        let updatedCommentOptions = _.cloneDeep(this.state.commentOptions);
        let charCount = this.state.charCount;

        if (item === 'selectedComment') {
            selectedComment = isSelected ? updatedCommentOptions[index].label : '';
            selectedCommentCase = isSelected ? updatedCommentOptions[index].value : '';
            enableDone = isSelected ? true : false;
            this.setState({ writtenComment: '', charCount: 60 })
        }

        else if (item === 'writtenComment') {
            updatedWrittenComment = event.target ? event.target.value : event.value;
            charCount = 60 - updatedWrittenComment.length;
            enableDone = !_.isEmpty(event.target)  && !_.isEmpty(event.target.value) ? true : false;
            this.setState({ writtenComment: updatedWrittenComment, charCount: charCount })
        }

        let finalIndex;
        if (index > -1) { finalIndex = index }
        else { finalIndex = this.state.selectedIndex }
        
        if (!(updatedWrittenComment === '' && selectedComment === '')) {
            enableDone = true;
        }

        this.setState({
            isSelected: isSelected,
            selectedComment: selectedComment,
            selectedCommentCase: selectedCommentCase,
            selectedIndex: finalIndex,
            enableDone: enableDone
        });
    }

    formSubmitHandler = () => {
        this.props.toggle();
        this.props.submitData(this.state);
    }

    onFocus = () => {
        this.setState({ onFocus: true })
    }
    
    onBlur = () => {
        this.setState({ onFocus: false })
    }

    render() {
        
        const { t } = this.props;
        let label = this.state.commentOptions && this.state.commentOptions[0] ? this.state.commentOptions[0].value : '';

        return (
            <div className={cx('d-flex flex-column', styles.backdrop)}>
                <div>
                    <img className={styles.closeStyle} src={closePage} onClick={this.props.toggle} alt={t('translation_verificationModal:image_alt_verificationModal.close')} />
                </div>
                <div className={cx(styles.Container, scrollStyle.scrollbar)}>

                    <div className='row ml-auto'>
                        {!_.isEmpty(this.state.commentOptions) ?
                            this.state.commentOptions.map((item, index) => {

                                if (index > 0 && this.state.commentOptions[index].value !== this.state.commentOptions[index - 1].value) {
                                    label = this.state.commentOptions[index].value
                                }
                                else if (index > 0 && this.state.commentOptions[index].value === this.state.commentOptions[index - 1].value) {
                                    label = ''
                                }
                                
                                return (
                                    <React.Fragment key={index}>
                                        {label === '' ? null :
                                            <div className={cx(styles.Label, 'w-100')}>
                                                {label} </div>}
                                        <div>
                                            <BoxRadioButton
                                                key={index}
                                                label={item.label}
                                                className={cx('mr-4 mb-3', styles.hoverDiv, styles.BoxWidth)}
                                                isSelected={(this.state.selectedIndex === index) ? this.state.isSelected : false}
                                                value={item.value}
                                                icon={item.icon}
                                                iconStyle={cx("my-auto", styles.img16px)}
                                                changed={(event) => this.handleInputChange(event, 'selectedComment', index)}
                                                disabled={this.state.writtenComment !== '' ? true : false}
                                            /> </div>
                                    </React.Fragment>
                                )
                            }) : null}
                    </div>

                    <div className='row no-gutters'>
                        <label className={styles.Label}>{t('translation_verificationModal:other')}</label>
                    </div>
                    <div className={this.state.onFocus ? styles.FocusWriteComment : styles.WriteComment}
                    onFocus={this.onFocus} disabled={this.state.isSelected ? true : false}
                    onBlur={this.onBlur}
                    >
                        <img src={writeComment} alt={t('translation_verificationModal:image_alt_verificationModal.cursor')} className={styles.Cursor} />
                        <textarea
                            style={{ resize: "none" }}
                            maxLength={60}
                            className={styles.inputField}
                            name='writtenComment'
                            rows='2'
                            label={t('translation_verificationModal:other')}
                            placeholder={t('translation_verificationModal:writeComment')}
                            value={this.state.writtenComment}
                            onChange={(event) => this.handleInputChange(event, 'writtenComment')}
                        />
                    </div>
                    <div className='row no-gutters'>
                        <label className={cx(styles.smallText, 'mt-1')}>{this.state.charCount} {t('translation_verificationModal:char')}</label>
                    </div>


                    <div className='row no-gutters justify-content-end'>
                        <Button type='save' label={t('translation_verificationModal:done')} clickHandler={this.formSubmitHandler} isDisabled={!this.state.enableDone} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default withTranslation()(connect(mapStateToProps, null)(VerificationModal));