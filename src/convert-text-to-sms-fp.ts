import { getDefaultSMS } from './utils';
import {
  fp,
  joinWordsToChunksFP,
  mapChunksWithSuffixFP,
  optimizeChunksLengthFP,
} from './utils-fp';
import { DELIMETER, MESSAGE_LENGTH } from './constants';
import type { TConvertTextToSms } from './types';

/**
 * Функция convertTextToSMSViaFP конвертирует входящий текст в формат СМС сообщений, ограниченных по длине.
 * В случае необходимости разбить сообщение на несколько смс, проставляет суфиксы.
 * 
 * @param text - входящий текст
 * @param delimeter - разделитель
 * @param messageMaxLenght - максимальная длина 1 смс
 * @returns - список СМС с проставленными суфиксами, если СМС > 1
 */
 export const convertTextToSMSViaFP: TConvertTextToSms = (
  text: string,
  delimeter: string = DELIMETER,
  messageMaxLenght: number = MESSAGE_LENGTH,
): string[] => {
  const defaultSMS = getDefaultSMS(text, messageMaxLenght);

  if (defaultSMS) {
    return defaultSMS;
  }

  const words: string[] = text.split(delimeter);

  return fp<string[], string[]>(words)(
    joinWordsToChunksFP(delimeter, messageMaxLenght),
    optimizeChunksLengthFP(delimeter, messageMaxLenght),
    mapChunksWithSuffixFP(delimeter),
  );
};
