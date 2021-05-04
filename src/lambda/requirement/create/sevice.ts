import axios from 'axios';
import db from '../../../connection';
import {encrypt} from "../../../utils/helpers";
import {MCI_URL} from "../../../utils/constants";

export const getDoctorData = (doctorRegistrationId: string): Promise<any> => {
    return axios.post(MCI_URL, {
        registrationNo: doctorRegistrationId
    })
        .then(res => res.data)
}

export const validateOTP = async (mobile: string, otp: string) => {
    return db.model('otp').findOne({
        where: {
            hash: await encrypt(mobile + otp)
        }
    })
}