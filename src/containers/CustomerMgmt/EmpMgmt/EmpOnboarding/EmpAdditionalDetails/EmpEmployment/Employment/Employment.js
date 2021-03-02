import React from 'react';
import _ from 'lodash';
import cx from 'classnames';

import {Input, Datepicker} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import DeleteButton from '../../../../../../../components/Molecule/DeleteButton/DeleteButton';
import Upload from '../../../../../../../components/Molecule/UploadDoc/UploadDoc';
import FileView from '../../../../../../../components/Molecule/FileView/FileView';
import BGVLabel from '../../BGVLabel/BGVLabel';

import upload from '../../../../../../../assets/icons/upload.svg';

import { validation, message } from './EmploymentValidation';
import { requiredFields } from './EmploymentInitData';
import styles from "./Employment.module.scss";

const Employment = (props) => {
    const data = _.cloneDeep(props.data);
    const errors = props.errors;
    let serialNumber = props.serialNumber
    return (
        <React.Fragment >
            <div className="d-flex mx-0 px-0 my-3">
                <div className={styles.formSubHead}>
                    {_.isEmpty(data['organisation']) ? 'employment ' + serialNumber : data['organisation'].toLowerCase()}
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
                    <div className="row no-gutters mt-2">
                        <CustomSelect
                            name='workedFor'
                            className="col-4 pl-0 py-3 pr-3"
                            required={_.includes(requiredFields, 'workedFor')}
                            label={'work type'}
                            options={props.options}
                            value={data['workedFor']}
                            errors={errors['workedFor']}
                            onChange={(value) => props.onChange(value, 'workedFor')}
                            onError={(error) => props.onError(error, 'workedFor')}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='organisation'
                            className='col-4 pr-3'
                            label={'organisation name'}
                            type='text'
                            placeholder={'organisation name'}
                            required={_.includes(requiredFields, 'organisation')}
                            value={data['organisation']}
                            errors={errors['organisation']}
                            onChange={(value) => props.onChange(value, 'organisation')}
                            onError={(error) => props.onError(error, 'organisation')}
                            validation={validation['organisation']}
                            message={message['organisation']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <hr className={styles.horizontalLine} />
                    <div className="row no-gutters mt-2">

                        <Input
                            name='hrName'
                            className='col-4 pr-3'
                            label={'HR name'}
                            type='text'
                            placeholder={'HR name'}
                            required={_.includes(requiredFields, 'hrName')}
                            value={data['hrName']}
                            errors={errors['hrName']}
                            onChange={(value) => props.onChange(value, 'hrName')}
                            onError={(error) => props.onError(error, 'hrName')}
                            validation={validation['hrName']}
                            message={message['hrName']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='hrMobile'
                            className='col-4 pr-3'
                            label={'HR mobile number'}
                            type='text'
                            placeholder={'HR mobile number'}
                            required={_.includes(requiredFields, 'hrMobile')}
                            value={data['hrMobile']}
                            errors={errors['hrMobile']}
                            onChange={(value) => props.onChange(value, 'hrMobile')}
                            onError={(error) => props.onError(error, 'hrMobile')}
                            validation={validation['hrMobile']}
                            message={message['hrMobile']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='hrEmail'
                            className='col-4 pr-3'
                            label={'HR email id'}
                            type='text'
                            placeholder={'HR email id'}
                            required={_.includes(requiredFields, 'hrEmail')}
                            value={data['hrEmail']}
                            errors={errors['hrEmail']}
                            onChange={(value) => props.onChange(value, 'hrEmail')}
                            onError={(error) => props.onError(error, 'hrEmail')}
                            validation={validation['hrEmail']}
                            message={message['hrEmail']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters mt-2">

                        <Input
                            name='reportingManagerName'
                            className='col-4 pr-3'
                            label={'reporting manager name'}
                            type='text'
                            placeholder={'reporting manager name'}
                            required={_.includes(requiredFields, 'reportingManagerName')}
                            value={data['reportingManagerName']}
                            errors={errors['reportingManagerName']}
                            onChange={(value) => props.onChange(value, 'reportingManagerName')}
                            onError={(error) => props.onError(error, 'reportingManagerName')}
                            validation={validation['reportingManagerName']}
                            message={message['reportingManagerName']}
                            disabled={props.isDisabled}
                        />

                        <Input
                            name='reportingManagerMobile'
                            className='col-4 pr-3'
                            label={'reporting manager number'}
                            type='text'
                            placeholder={'reporting manager number'}
                            required={_.includes(requiredFields, 'reportingManagerMobile')}
                            value={data['reportingManagerMobile']}
                            errors={errors['reportingManagerMobile']}
                            onChange={(value) => props.onChange(value, 'reportingManagerMobile')}
                            onError={(error) => props.onError(error, 'reportingManagerMobile')}
                            validation={validation['reportingManagerMobile']}
                            message={message['reportingManagerMobile']}
                            disabled={props.isDisabled}
                        />

                        <Input
                            name='reportingManagerEmail'
                            className='col-4 pr-3'
                            label={'reporting manager email id'}
                            type='text'
                            placeholder={'reporting manager email id'}
                            required={_.includes(requiredFields, 'reportingManagerEmail')}
                            value={data['reportingManagerEmail']}
                            errors={errors['reportingManagerEmail']}
                            onChange={(value) => props.onChange(value, 'reportingManagerEmail')}
                            onError={(error) => props.onError(error, 'reportingManagerEmail')}
                            validation={validation['reportingManagerEmail']}
                            message={message['reportingManagerEmail']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <hr className={styles.horizontalLine} />
                    <div className="row no-gutters mt-2">

                        <Input
                            name='designation'
                            className='col-4 pr-3'
                            label={'designation'}
                            type='text'
                            placeholder={'designation'}
                            required={_.includes(requiredFields, 'designation')}
                            value={data['designation']}
                            errors={errors['designation']}
                            onChange={(value) => props.onChange(value, 'designation')}
                            onError={(error) => props.onError(error, 'designation')}
                            validation={validation['designation']}
                            message={message['designation']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='employeeId'
                            className='col-4 pr-3'
                            label={'employee id'}
                            type='text'
                            placeholder={'employee id'}
                            required={_.includes(requiredFields, 'employeeId')}
                            value={data['employeeId']}
                            errors={errors['employeeId']}
                            onChange={(value) => props.onChange(value, 'employeeId')}
                            onError={(error) => props.onError(error, 'employeeId')}
                            validation={validation['employeeId']}
                            message={message['employeeId']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters mt-2">
                        <Datepicker
                            name='joinedFrom'
                            className="col-4 pr-3"
                            label={'joined form'}
                            required={_.includes(requiredFields, 'joinedFrom')}
                            value={data['joinedFrom']}
                            errors={errors['joinedFrom']}
                            onChange={(value) => props.onChange(value, 'joinedFrom')}
                            onError={(error) => props.onError(error, 'joinedFrom')}
                            validation={validation['joinedFrom']}
                            message={message['joinedFrom']}
                            disabled={props.isDisabled}
                        />
                        <Datepicker
                            name='workedUntil'
                            className="col-4 pr-3"
                            label={'worked until'}
                            required={_.includes(requiredFields, 'workedUntil')}
                            value={data['workedUntil']}
                            errors={errors['workedUntil']}
                            onChange={(value) => props.onChange(value, 'workedUntil')}
                            onError={(error) => props.onError(error, 'workedUntil')}
                            validation={validation['workedUntil']}
                            message={message['workedUntil']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='salary'
                            className='col-4 pr-3'
                            label={'renumeration/salary'}
                            type='text'
                            placeholder={'renumeration/salary'}
                            required={_.includes(requiredFields, 'salary')}
                            value={data['salary']}
                            errors={errors['salary']}
                            onChange={(value) => props.onChange(value, 'salary')}
                            onError={(error) => props.onError(error, 'salary')}
                            validation={validation['salary']}
                            message={message['salary']}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className='row no-gutters mt-1 pb-2'>
                        <div>
                            <Upload
                                upload={upload}
                                id={'uploadEmployment' + props.index}
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
export default Employment;