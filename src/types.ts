export type TConvertTextToSms = (
  text: string,
  delimeter?: string,
  messageMaxLenght?: number,
) => string[];