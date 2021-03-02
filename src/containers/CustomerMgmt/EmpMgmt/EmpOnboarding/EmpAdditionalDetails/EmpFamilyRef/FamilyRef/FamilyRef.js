import React from 'react';
import _ from 'lodash';

import {Input, Datepicker} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import DeleteButton from '../../../../../../../components/Molecule/DeleteButton/DeleteButton';

import BGVLabel from '../../BGVLabel/BGVLabel';

import { validation, message } from './FamilyRefValidation';
import { requiredFields } from './FamilyRefInitData';
import styles from "./FamilyRef.module.scss";

const FamilyRef = (props) => {
    const data = _.cloneDeep(props.data);
    const errors = props.errors;
    const serialNumber = props.serialNumber

    return (

        <React.Fragment >
            <div className="row mx-0 px-0 my-3">
                <div className={styles.formSubHead}>
                    {_.isEmpty(data['relationship']) ? 'relation ' + serialNumber : data['relationship'].toLowerCase()}
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
                            name='relationship'
                            className="col-4 pl-0 py-0 pr-3"
                            required={_.includes(requiredFields, 'relationship')}
                            label={'relationship'}
                            options={props.options}
                            value={data['relationship']}
                            errors={errors['relationship']}
                            onChange={(value) => props.onChange(value, 'relationship')}
                            onError={(error) => props.onError(error, 'relationship')}
                            disabled={props.isDisabled}
                        />
                    </div>
                    <div className="row no-gutters mt-2">

                        <Input
                            name='name'
                            className='col-4 pr-3'
                            label={'name'}
                            type='text'
                            placeholder={'enter name'}
                            required={_.includes(requiredFields, 'name')}
                            value={data['name']}
                            errors={errors['name']}
                            onChange={(value) => props.onChange(value, 'name')}
                            onError={(error) => props.onError(error, 'name')}
                            validation={validation['name']}
                            message={message['name']}
                            disabled={props.isDisabled}
                        />
                        <Datepicker
                            name='dob'
                            className="col-4 pr-3"
                            label={'date of birth'}
                            required={_.includes(requiredFields, 'dob')}
                            value={data['dob']}
                            errors={errors['dob']}
                            onChange={(value) => props.onChange(value, 'dob')}
                            onError={(error) => props.onError(error, 'dob')}
                            validation={validation['dob']}
                            message={message['dob']}
                            disabled={props.isDisabled}
                        />
                        <Input
                            name='mobile'
                            className='col-4 pr-3'
                            label={'mobile'}
                            type='text'
                            placeholder={'mobile number'}
                            required={_.includes(requiredFields, 'mobile')}
                            value={data['mobile']}
                            errors={errors['mobile']}
                            onChange={(value) => props.onChange(value, 'mobile')}
                            onError={(error) => props.onError(error, 'mobile')}
                            validation={validation['mobile']}
                            message={message['mobile']}
                            disabled={props.isDisabled}
                        />
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}
export default FamilyRef;