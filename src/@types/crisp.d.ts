export declare global {
  interface Window {
    CRISP_WEBSITE_ID?: string;
    $crisp?: Crisp | List[];
  }

  interface Crisp {
    is(key: string): boolean;
    get(key: string, index?: string): unknown;
    push(arr: List);
  }
}
