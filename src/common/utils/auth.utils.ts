// utils/authUtils.js
import Kavenegar from 'kavenegar';

export function sendOTPSMS(phone: string, otp: string) {
  const OtpApi = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY as string,
  });
  OtpApi.VerifyLookup(
    {
      receptor: phone,
      token: otp,
      template: 'nestotp',
    },
    function (_response, status) {
      console.log(`message send with status : ${status}`);
    },
  );
}
