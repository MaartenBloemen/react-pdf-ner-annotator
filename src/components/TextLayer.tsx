import React from 'react';
import deburr from 'lodash/deburr';
import { TextLayerItem } from '../interfaces/textLayer';
import { generateRandomId } from '../helpers/generalHelpers';
import TokenContainer from './TokenContainer';
import { Annotation } from '../interfaces/annotation';
import hash from 'object-hash';

interface Props {
  inView: boolean;
  canvasInitialized: boolean;
  isAnnotating: boolean;
  textLayer: Array<TextLayerItem>|null;
  tokenizer: RegExp;
  annotations: Array<Annotation>;
  removeAnnotation: (id: string) => void;
}

const TextLayer = ({ inView, canvasInitialized, isAnnotating, textLayer, tokenizer, annotations, removeAnnotation }: Props) => {
  if (inView && canvasInitialized && textLayer?.length) {
    let offset = 0;
    return (
      <>
        {
          textLayer.map((textLayerItem) => {
            const tokens = deburr(textLayerItem.text).match(tokenizer);
            const filteredTokenLength = tokens.filter((t) => t !== ' ').length;
            offset += filteredTokenLength;
            return (
              <TokenContainer
                key={hash(textLayerItem)}
                isAnnotating={isAnnotating}
                textLayerItem={textLayerItem}
                tokens={tokens}
                offset={offset - filteredTokenLength}
                annotations={annotations}
                removeAnnotation={removeAnnotation}
              />
            );
          })
        }
      </>
    );
  }

  return null;
};

export default TextLayer;
