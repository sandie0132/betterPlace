import React from 'react';
import styles from './Paginator.module.scss';
import cx from 'classnames';
import { withRouter } from "react-router";
import left from '../../../assets/icons/left.svg';
import right from '../../../assets/icons/right.svg';
import { withTranslation } from 'react-i18next';

class Paginator extends React.Component {

    handleGetPageNumberFromUrl = () => {
        const searchQuery = this.props.location.search;
        const regex = /(?:pageNumber=)([0-9]+)/;
        const searchResult = searchQuery.match(regex);
        let pageNumber = -1;
        if (searchResult) {
            pageNumber = parseInt(searchResult[1], 10);
        }
        return pageNumber;
    }

    handleCalculateCurrentIndex = (type) => {
        const totalData = this.props.dataCount;
        const currentPage = this.handleGetPageNumberFromUrl();
        if (type === 'from') {
            const from = (currentPage - 1) * this.props.pageSize + 1;
            if (from >= totalData) return totalData;
            else return from;
        }
        else if (type === 'to') {
            const to = currentPage * this.props.pageSize;
            if (to >= totalData) return totalData;
            else return to;
        }
    }

    handlePrevDisableCheck = () => {
        if (this.handleGetPageNumberFromUrl() > 1) return false;
        else return true;
    }

    handleNextDisableCheck = () => {
        const totalPages = Math.ceil(this.props.dataCount / this.props.pageSize);
        if (this.handleGetPageNumberFromUrl() === totalPages) return true;
        else return false;
    }

    handlePrevButtonClick = () => {
        const nextPage = this.handleGetPageNumberFromUrl() - 1;
        const regex = /(?:pageNumber=)([0-9]+)/;
        const newSearchPath = this.props.location.search.replace(regex, 'pageNumber=' + nextPage);
        const redirectPath = this.props.baseUrl + newSearchPath;
        this.props.history.push(redirectPath);
    }

    handleNextButtonClick = () => {
        const nextPage = this.handleGetPageNumberFromUrl() + 1;
        const regex = /(?:pageNumber=)([0-9]+)/;
        const newSearchPath = this.props.location.search.replace(regex, 'pageNumber=' + nextPage);
        let redirectPath = this.props.baseUrl + newSearchPath;
        this.props.history.push(redirectPath);
    }

    render() {
        const { t } = this.props;
        return this.props.dataCount > 1 ? (
            <div className={cx(styles.Pagination, this.props.className)}>

                <div className={cx(styles.PaginationAlign, "ml-auto")}>
                    <div className={cx(styles.PaginationRecords)}>                        
                        {this.handleCalculateCurrentIndex('from')} - {this.handleCalculateCurrentIndex('to')} of {this.props.dataCount}
                    </div>
                    <div style={{ marginTop: '2px' }}>
                        <span >
                            <button
                                className={cx({ [styles.ArrowDisable]: this.handlePrevDisableCheck() }, styles.Arrow)}
                                disabled={this.handlePrevDisableCheck()}
                                onClick={this.handlePrevButtonClick}
                            >
                                <img src={left} alt={t('translation_empList:image_alt.left')} />
                            </button>
                        </span>
                        <span>
                            <button
                                className={cx({ [styles.ArrowDisable]: this.handleNextDisableCheck() }, styles.Arrow)}
                                disabled={this.handleNextDisableCheck()}
                                onClick={this.handleNextButtonClick}
                            >
                                <img src={right} alt={t('translation_empList:image_alt.right')} />
                            </button>
                        </span>
                    </div>
                </div>
                <br></br>
            </div>
        ) : '';
    }
}

export default withTranslation()(withRouter(Paginator));