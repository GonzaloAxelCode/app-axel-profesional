declare module 'expo-barcode-generator' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface BarcodeOptions {
    format?: string;
    width?: number;
    height?: number;
    background?: string;
    lineColor?: string;
    displayValue?: boolean;
    font?: string;
    fontSize?: number;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    margin?: number;
  }

  interface BarcodeProps {
    value: string;
    options?: BarcodeOptions;
    rotation?: number;
    style?: ViewStyle;
  }

  export class Barcode extends Component<BarcodeProps> {}
}
