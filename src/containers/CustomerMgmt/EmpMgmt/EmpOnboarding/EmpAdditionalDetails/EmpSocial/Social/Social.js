import React from 'react';
import _ from 'lodash';

import {Input} from 'react-crux';
import CustomSelect from '../../../../../../../components/Atom/CustomSelect/CustomSelect';
import DeleteButton from '../../../../../../../components/Molecule/DeleteButton/DeleteButton';

import { validation, message } from './SocialValidation';
import { requiredFields } from './SocialInitData';
import styles from "./Social.module.scss";

const Social = (props) => {
    const data = _.cloneDeep(props.data);
    const errors = props.errors;
    const serialNumber = props.serialNumber

    return (
        <React.Fragment>
            <div className="row mx-0 px-0">
                <div className={styles.formSubHead}>
                    {_.isEmpty(data['platform']) ? 'social ' + serialNumber : data['platform'].toLowerCase()}
                </div>
                <div className="ml-auto">
                    <DeleteButton
                        label={'delete'}
                        isDeleteIconRequired={true}
                        clickHandler={props.onDelete}
                        className={"mt-2"}
                    /></div>
            </div>
            <form>
                <div className="row no-gutters">
                    <CustomSelect
                        name='platform'
                        className="col-4 pt-2 my-2 pr-4"
                        required={_.includes(requiredFields, 'platform')}
                        label={'platform'}
                        options={props.EMP_MGMT_PLATFORM}
                        value={data['platform']}
                        errors={errors['platform']}
                        onChange={(value) => props.onChange(value, 'platform')}
                        onError={(error) => props.onError(error, 'platform')}
                    />
                    <Input
                        name='profileUrl'
                        className='col-4 pr-3'
                        label={'profile url'}
                        type='text'
                        placeholder={'http://www.website.com'}
                        required={_.includes(requiredFields, 'profileUrl')}
                        value={data['profileUrl']}
                        errors={errors['profileUrl']}
                        onChange={(value) => props.onChange(value, 'profileUrl')}
                        onError={(error) => props.onError(error, 'profileUrl')}
                        validation={validation['profileUrl']}
                        message={message['profileUrl']}
                    />
                </div>

            </form>
        </React.Fragment>
    );
}
export default Social;