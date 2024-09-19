// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

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
