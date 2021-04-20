import { joinWordsToChunks, mapChunksWithSuffix, optimizeChunksLength } from './utils';
import { DELIMETER, MESSAGE_LENGTH } from './constants';
import type { TConvertTextToSms } from './types';

/**
 * Функция convertTextToSMS конвертирует входящий текст в формат СМС сообщений, ограниченных по длине.
 * В случае необходимости разбить сообщение на несколько смс, проставляет суфиксы.
 * 
 * @param text - входящий текст
 * @param delimeter - разделитель
 * @param messageMaxLenght - максимальная длина 1 смс
 * @returns - список СМС с проставленными суфиксами, если СМС > 1
 */
 export const convertTextToSMS: TConvertTextToSms = (
    text: string,
    delimeter: string = DELIMETER,
    messageMaxLenght: number = MESSAGE_LENGTH,
  ): string[] => {
    if (text.length <= messageMaxLenght) {
      return [text];
    }
  
    const words: string[] = text.split(delimeter);
    const chunks: string[] = joinWordsToChunks(words, delimeter, messageMaxLenght);
    const chunksWithOptimizedLength = optimizeChunksLength(chunks, delimeter, messageMaxLenght);
    const chunksWithSuffixes = mapChunksWithSuffix(chunksWithOptimizedLength, delimeter);
  
    return chunksWithSuffixes;
  };