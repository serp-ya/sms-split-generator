import { SUFFIX_DELIMETER } from './constants';

/**
 * Функция createSuffix создаёт суфикс вида 1/10 
 * 
 * @param currentNumber - число в левой части суфикса
 * @param lastNumber - число в правой части суфикса
 * @returns - строку вида '1/10'
 */
 const createSuffix = (
    currentNumber: number,
    lastNumber: number,
  ): string => `${currentNumber}${SUFFIX_DELIMETER}${lastNumber}`;
  
  /**
   * Функция mapChunksWithSuffix проставляет суфиксы переданным чанкам
   * 
   * @param chunks - чанки - список строк 
   * @param delimeter - разделитель
   * @returns - список чанков с суфиксами
   */
  export const mapChunksWithSuffix = (chunks: string[], delimeter: string): string[] => (
    chunks.map((chunk: string, i: number, arr: string[]): string => (
      [chunk, createSuffix(i + 1, arr.length)].join(delimeter)
    ))
  );
  
  /**
   * Функция joinWordsToChunks объединяет переданные слова в чанки (строки) определенной длины
   * 
   * @param words - список слов
   * @param delimeter - разелитель
   * @param chunkMaxLength - максимальная длина одного чанка
   * @returns - список чанков, состоящий из переданных слов (строки определенной длины)
   */
  export const joinWordsToChunks = (
    words: string[],
    delimeter: string,
    chunkMaxLength: number,
  ): string[] => words.reduce((acc: string[], word: string, i: number) => {
    const lastChunkIndex = acc.length - 1;
    const lastChunk: string | undefined = acc[lastChunkIndex];
    if (!lastChunk) {
      return [word];
    }
  
    const newChunk: string = [lastChunk, word].join(delimeter);
  
    if (newChunk.length < chunkMaxLength) {
      acc[lastChunkIndex] = newChunk;
    } else {
      acc.push(word);
    }
    return acc;
  }, []);
  
  /**
   * Функция optimizeChunksLength оптимизирует длину чанков и подготавливает их
   * под добавление суфикса без нарушения ограничения по длине
   * 
   * @param chunks - список чанков
   * @param delimeter - разделитель
   * @param chunkMaxLength - максимальная длина чанка
   * @returns - список чанков с проставленными суфиксами
   */
  export const optimizeChunksLength = (
    chunks: string[],
    delimeter: string,
    chunkMaxLength: number,
  ): string[] => {
    let needToRevalidateChunks = false;

    const result = chunks.reduce((
      acc: string[],
      chunk: string,
      i: number,
      arr: string[],
    ) => {
      const suffix: string = createSuffix(i + 1, arr.length);
      const chunkWithSuffix: string = [chunk, suffix].join(delimeter);
    
      if (chunkWithSuffix.length > chunkMaxLength) {
        const currentChunkAllWords: string[] = chunk.split(delimeter);

        const [optimizedCurrentChunk, replacedChunk] = currentChunkAllWords.reduce((
          optimizedChunks: [string, string],
          word: string,
        ) => {
          const [currentChunk, cuttedChunk] = optimizedChunks;
          const updatedCurrentChunk = Boolean(currentChunk) 
            ? [currentChunk, word].join(delimeter)
            : word;
          const updatedCurrentChunkWithSuffix = [updatedCurrentChunk, suffix].join(delimeter);

          if (updatedCurrentChunkWithSuffix.length < chunkMaxLength) {
            optimizedChunks[0] = updatedCurrentChunk;
          } else {
            optimizedChunks[1] = Boolean(cuttedChunk)
              ? [cuttedChunk, word].join(delimeter)
              : word;
          }

          return optimizedChunks;
        }, ['', '']);

        const nextChunk = arr[i + 1] || '';
        acc.push(optimizedCurrentChunk);
        arr[i + 1] = [replacedChunk, nextChunk].join(delimeter);

        needToRevalidateChunks = true;

      } else {
        acc.push(chunk);
      }
      
      return acc;
    }, []);

    return needToRevalidateChunks
      ? optimizeChunksLength(result, delimeter, chunkMaxLength)
      : result;
  };
  

/**
 * Функция getDefaultSMS проверит по определенным правилам, можно ли преобразовать
 * входящий текст в "СМС по-умолчанию". Если да, вернёт это СМС
 * 
 * @param text - входящий текст
 * @param delimeter - разделитель между слов во входящем тексте
 * @param messageMaxLenght - максимальная длина одной СМС
 * @returns - либо вернёт "СМС по-умолчанию", либо ничего не вернёт,
 * если текст корректный, но "СМС по-умолчанию" не соответствует
 * определенным правилам
 */
export const getDefaultSMS = (
    text: string,
    messageMaxLenght: number,
): string[] | undefined => {
    if (text.length <= messageMaxLenght) {
      return [text];
    }
};