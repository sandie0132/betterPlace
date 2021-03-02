import React, { Component } from 'react';
import styles from '../TagWithInput/TagWithInput.module.scss';
import AutoComplete from '../../../components/Molecule/AutoComplete/AutoComplete';
import close from '../../../assets/icons/cross.svg';
import cx from 'classnames';

class TagWithInput extends Component {
    state = {
        tags: []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({ tags: this.props.value });
        }
    }

    handleDeleteTag = (targetIndex) => {
        let updatedTags = this.state.tags.filter((tag, index) => {
            if (index === targetIndex) return null;
            else return (tag);
        })
        this.props.onNewTag({ value: updatedTags });
        this.setState({ tags: updatedTags })
    }

    handleTagChildArray = (event) => {
        const updatedObject = {
            name: event.value
        }
        let updatedTags = [updatedObject, ...this.state.tags];
        this.props.onNewTag({ value: updatedTags });
        this.setState({ tags: updatedTags })
    }

    render() {
        return (
            <React.Fragment>
                <AutoComplete
                    label={this.props.label}
                    suggestions={this.props.suggestions}
                    placeholder={this.props.placeholder}
                    addNewTag={(event) => this.handleTagChildArray(event)}
                    disabled={this.props.disabled}
                    selectedTags={this.state.tags}
                // className={styles.wordBreak}
                />
                {this.state.tags.map((tag, index) => {
                    return (
                        <div key={index} className={cx(styles.TabButton)}>
                            <div disabled={this.props.disabled} className={cx(styles.Tabs, "my-1 ")}>
                                <span className={styles.tagName}>{tag.name.toLowerCase().replace(/_/g, " ")}</span>
                                <img src={close} alt="close" className={styles.closeButton} onClick={() => this.handleDeleteTag(index)} />
                            </div>
                        </div>
                    )
                })}
            </React.Fragment>
        )
    }
}
export default TagWithInput;