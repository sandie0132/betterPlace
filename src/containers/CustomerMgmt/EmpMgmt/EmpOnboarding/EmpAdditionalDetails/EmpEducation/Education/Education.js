import React from 'react';
import _ from 'lodash';
import cx from 'classnames';

import {Input, Datepicker} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import DeleteButton from '../../../../../../../components/Molecule/DeleteButton/DeleteButton';
import Upload from '../../../../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../../../../components/Molecule/FileView/FileView';
import BGVLabel from '../../BGVLabel/BGVLabel';

import { validation, message } from './EducationValidation';
import { requiredFields } from './EducationInitData';
import styles from "./Education.module.scss";

import upload from '../../../../../../../assets/icons/upload.svg';

const Education = (props) => {
    const data = _.cloneDeep(props.data);
    const errors = props.errors;
    const serialNumber = props.serialNumber

    return (
        <React.Fragment>
            <div className="row mx-0 px-0 my-3">
                <div className={styles.formSubHead}>
                    {_.isEmpty(data['educationType']) ? 'education ' + serialNumber : data['educationType'].replace('_', ' ').toLowerCase()}
                </div>
                <div className="ml-auto">
                    {
                        !_.isEmpty(props.bgvMissingInfo) ?
                            <div className={"ml-auto mr-2"}>
                                <BGVLabel
                                    missingInfoData={props.bgvMissingInfo}
                                    type="missingInfo"
                                />
                            </div>

                            :
                            !_.isEmpty(props.bgvData) ?
                                <div className="ml-auto">
                                    <BGVLabel
                                        bgvData={props.bgvData}
                                        type="bgvStatus" />
                                </div>

                                :
                                <DeleteButton
                                    label={'delete'}
                                    isDisabled={props.disableSectionAddDelete}
                                    isDeleteIconRequired={true}
                                    clickHandler={props.onDelete}
                                />
                    }

                </div>

            </div>
            <div className={props.isDisabled ? styles.showOpacity : null}>
                <form>

                    <div className='row no-gutters mt-2'>
                        <CustomSelect
                            name='educationType'
                            className='col-4 pr-3'
                            label={'education type'}
                            required={_.includes(requiredFields, 'educationType')}
                            options={props.options}
                            value={data.educationType}
                            errors={errors['educationType']}
                            onChange={(value) => props.onChange(value, 'educationType')}
                            onError={(error) => props.onError(error, 'educationType')}
                            validation={validation['educationType']}
                            message={message['educationType']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters mt-2">
                        <Input
                            name='school_college'
                            className="col-4 pr-3"
                            label={'school/college'}
                            type='text'
                            placeholder={'school/college'}
                            required={_.includes(requiredFields, 'school_college')}
                            value={data.school_college}
                            errors={errors['school_college']}
                            onChange={(value) => props.onChange(value, 'school_college')}
                            onError={(error) => props.onError(error, 'school_college')}
                            validation={validation['school_college']}
                            message={message['school_college']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='board_university'
                            className="col-4"
                            label={'board/university'}
                            type='text'
                            placeholder={'board/university'}
                            required={_.includes(requiredFields, 'board_university')}
                            value={data.board_university}
                            errors={errors['board_university']}
                            onChange={(value) => props.onChange(value, 'board_university')}
                            onError={(error) => props.onError(error, 'board_university')}
                            validation={validation['board_university']}
                            message={message['board_university']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters">
                        <Input
                            name='course'
                            className="col-4 pr-3"
                            label={'course'}
                            type='text'
                            placeholder={'course'}
                            required={_.includes(requiredFields, 'course')}
                            value={data.course}
                            errors={errors['course']}
                            onChange={(value) => props.onChange(value, 'course')}
                            onError={(error) => props.onError(error, 'course')}
                            validation={validation['course']}
                            message={message['course']}
                            disabled={props.isDisabled}
                        />
                        <Datepicker
                            name='from'
                            className="col-4 pr-3"
                            label={'from'}
                            required={_.includes(requiredFields, 'from')}
                            value={data.from}
                            errors={errors['from']}
                            onChange={(value) => props.onChange(value, 'from')}
                            onError={(error) => props.onError(error, 'from')}
                            validation={validation['from']}
                            message={message['from']}
                            disabled={props.isDisabled}
                        />

                        <Datepicker
                            name='to'
                            className="col-4"
                            label={'to'}
                            required={_.includes(requiredFields, 'to')}
                            value={data.to}
                            errors={errors['to']}
                            onChange={(value) => props.onChange(value, 'to')}
                            onError={(error) => props.onError(error, 'to')}
                            validation={validation['to']}
                            message={message['to']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters">
                        <Input
                            name='cgpa_percentage'
                            className="col-4 pr-3"
                            label={'cgpa/percentage'}
                            type='text'
                            placeholder={'cgpa/percentage'}
                            required={_.includes(requiredFields, 'cgpa_percentage')}
                            value={data.cgpa_percentage}
                            errors={errors['cgpa_percentage']}
                            onChange={(value) => props.onChange(value, 'cgpa_percentage')}
                            onError={(error) => props.onError(error, 'cgpa_percentage')}
                            validation={validation['cgpa_percentage']}
                            message={message['cgpa_percentage']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='passedYear'
                            className="col-4 pr-3"
                            label={'passed year'}
                            type='text'
                            placeholder={'passed year'}
                            required={_.includes(requiredFields, 'passedYear')}
                            value={data.passedYear}
                            errors={errors['passedYear']}
                            onChange={(value) => props.onChange(value, 'passedYear')}
                            onError={(error) => props.onError(error, 'passedYear')}
                            validation={validation['passedYear']}
                            message={message['passedYear']}
                            disabled={props.isDisabled}

                        />
                    </div>
                    <div className='row no-gutters mt-1 pb-2'>
                        <div>
                            <Upload
                                upload={upload}
                                id={'uploadEducation' + props.index}
                                fileUpload={(file) => props.onFileUpload(file)}
                                addState={props.uploadFileState}
                                className={styles.Cursor}
                                disabled={props.isDisabled}
                            />
                        </div>
                        {
                            !_.isEmpty(data['downloadURL']) ?
                                data['downloadURL'].map((url, index) => {
                                    return (
                                        <FileView
                                            key={index}
                                            className={cx(styles.Preview, 'ml-2 mb-2')}
                                            url={url}
                                            fileClicked={() => props.onFileDownload(url)}
                                            downloadFileState={_.includes(props.downloadingURLs, url) ? props.downloadFileState : null}
                                            clicked={(e) => props.onDeleteFile(e, url)}
                                            disabled={props.isDisabled}
                                        />
                                    )
                                }) :
                                null
                        }
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}
export default Education;