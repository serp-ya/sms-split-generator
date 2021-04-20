import { joinWordsToChunks, optimizeChunksLength, mapChunksWithSuffix } from './utils';

/**
 * Функция fp принимает значения, которые по очереди нужно передать в фунцкии-обработчики
 * и возвращает функцию, которая принимает эти фунцкии-обработчики.
 * 
 * @param data - значения для обработки
 * @returns - функцию, принимающую функции-обработчики и возвращающую результат поочерёдной обработки входящих значений
 */
 export const fp = <D, R>(data: D) => (
    ...funcs: Function[]
  ): R => (
    funcs.reduce(
      (acc: any, func) => func(acc),
      data,
    )
  );
  
  /**
   * Функция joinWordsToChunksFP каррирует конфигурационные аргументы функции joinWordsToChunks
   * и создаёт на основе неё обработчик для дальнейшего применения к проивзольным значениям
   * 
   * @param delimeter - разделитель
   * @param chunkMaxLength - максимальная длина чанка
   * @returns - функцию, принимающую список значений и передающий их функции joinWordsToChunks
   */
  export const joinWordsToChunksFP = (
    delimeter: string,
    chunkMaxLength: number,
  ) => (words: string[]): string[] => joinWordsToChunks(words, delimeter, chunkMaxLength);
  
  /**
   * Функция optimizeChunksLengthFP каррирует конфигурационные аргументы функции optimizeChunksLength
   * 
   * @param delimeter - разделитель
   * @param chunkMaxLength - максимальная длина чанка
   * @returns - функцию, принимающую список значений и передающий их функции optimizeChunksLength
   */
  export const optimizeChunksLengthFP = (
    delimeter: string,
    chunkMaxLength: number,
  ) => (chunks: string[]) => optimizeChunksLength(chunks, delimeter, chunkMaxLength);
  
  /**
   * Функция mapChunksWithSuffixFP каррирует конфигурационные аргументы функции mapChunksWithSuffix
   * 
   * @param delimeter - разделитель
   * @returns - функцию, принимающую список значений и передающий их функции mapChunksWithSuffix
   */
  export const mapChunksWithSuffixFP = (delimeter: string) => (chunks: string[]) => mapChunksWithSuffix(chunks, delimeter);
  